import createParser from "./createParser";

function parseJava(code: string) {
  const blueKeywords = [
    "abstract", "class", "const", "default", "do", "double", "else", "enum",
    "false", "final", "goto", "import", "instanceof", "interface", "native", "new", "null",
    "package", "private", "protected", "public", "static", "strictfp", "super", 
    "switch", "synchronized", "this", "transient", "true", "void", "volatile", "while"
  ];
  const purpleKeywords = [
    "break", "continue", "return", "throw", "throws", "try", "catch", "finally",
    "case", "default", "do", "else", "for", "if", "switch", "while", "assert",
    "extends", "implements", "import", "package", "super"
  ];
  const yellowKeywords = [
    "@Deprecated", "@Override", "@SuppressWarnings", "@FunctionalInterface"
  ];
  const greenKeywords = [
    "double", "int", "long", "float", "boolean", "char", "byte", "short", "Integer",
    "Long", "Double", "Float", "Boolean", "Character", "Byte", "Short", "String", "Object",
    "Math", "Arrays", "Collections", "List", "Set", "Map", "HashMap", "HashSet", "TreeMap",
    "TreeSet", "ArrayList", "LinkedList", "PriorityQueue", "Stack", "Queue", "Deque", "ArrayDeque",
    "Vector", "Hashtable", "Properties", "Stream", "Optional", "Scanner", "Random", "Date",
    "System", "out", "println", "print", "err", "printf", "format", "exit", "currentTimeMillis",
    "nanoTime", "arraycopy", "identityHashCode", "getenv", "gc"
  ];
  const specialCharacters = [":", ",", "<", ">", "."];
  return new createParser(
    blueKeywords,
    purpleKeywords,
    yellowKeywords,
    greenKeywords,
    specialCharacters
  ).parse(code);
}

export default parseJava;