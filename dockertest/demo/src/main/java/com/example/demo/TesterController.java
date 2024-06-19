package com.example.demo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.tools.*;
import java.io.IOException;
import java.lang.reflect.Method;
import java.net.URI;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.*;

@RestController
public class CodeExecutionController {

    @PostMapping("/run-tests")
    public ResponseEntity<List<Map<String, Object>>> runTests(@RequestBody TestData testData) {
        List<Map<String, Object>> results = new ArrayList<>();

        try {
            // Create the full Java source code from the user-provided code
            String className = "UserFunction";
            String fullSourceCode = "public class " + className + " { " + testData.getUsercode() + " }";

            // Compile the source code
            JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
            DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();
            StandardJavaFileManager fileManager = compiler.getStandardFileManager(diagnostics, null, null);

            JavaFileObject file = new JavaSourceFromString(className, fullSourceCode);
            Iterable<? extends JavaFileObject> compilationUnits = Arrays.asList(file);
            JavaCompiler.CompilationTask task = compiler.getTask(null, fileManager, diagnostics, null, null, compilationUnits);

            if (!task.call()) {
                for (Diagnostic<? extends JavaFileObject> diagnostic : diagnostics.getDiagnostics()) {
                    System.err.println(diagnostic.getMessage(null));
                }
                return ResponseEntity.status(500).body(List.of(Map.of("error", "Compilation failed")));
            }

            // Load and instantiate compiled class
            URLClassLoader classLoader = URLClassLoader.newInstance(new URL[]{new File("").toURI().toURL()});
            Class<?> cls = Class.forName(className, true, classLoader);
            Method method = cls.getMethod(testData.getFunctionName(), List.class);

            for (TestCase testCase : testData.getTestCases()) {
                Map<String, Object> input = testCase.getInput();
                Object expected = input.remove("expected");
                List<Object> args = new ArrayList<>();
                for (String arg : testData.getFormat()) {
                    args.add(input.get(arg));
                }

                Object result = method.invoke(null, args.toArray());
                boolean passed = result.equals(expected);

                results.add(Map.of("test", input, "passed", passed, "result", result, "expected", expected));
            }

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(List.of(Map.of("error", e.getMessage())));
        }
    }

    class JavaSourceFromString extends SimpleJavaFileObject {
        final String code;

        JavaSourceFromString(String name, String code) {
            super(URI.create("string:///" + name.replace('.', '/') + Kind.SOURCE.extension), Kind.SOURCE);
            this.code = code;
        }

        @Override
        public CharSequence getCharContent(boolean ignoreEncodingErrors) {
            return code;
        }
    }
}
