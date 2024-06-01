import createParser from "./createParser";

function parseJs(code: string) {
  const blueKeywords = [
    "class", "const", "constructor", "debugger", "default", "delete", "export", "extends", "function",
    "in", "instanceof", "let", "new", "super", "this", "try", "typeof", "var", "void",
    "enum", "implements", "interface", "static",  "abstract", "null", "undefined", "NaN",
    "Infinity", "eval", "arguments", "prototype", "apply", "bind", "call", "async", "document", "window"
  ];
  const purpleKeywords = [
    "break", "case", "catch", "continue", "default", "do", "else", "finally", "for", "if", "import",
    "switch", "throw", "try", "while", "with", "package", "yield", "goto", "synchronized", 
    "transient", "volatile", "return", "throw", "try", "while", "with", "await"
  ];
  const yellowKeywords = [
    "console", "alert", "prompt", "confirm", "setInterval", "setTimeout", "clearInterval", "clearTimeout",
    "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", 
    "encodeURIComponent", "localStorage", "sessionStorage", "fetch", "XMLHttpRequest", "FormData", "WebSocket", 
    "Worker", "importScripts", "postMessage", "MessageChannel", "MessagePort", "MessageEvent"
  ];
  const greenKeywords = [
    "private", "protected", "public", "boolean", "byte", "char", "double", "float", "int",
    "long", "short", "Array", "Date", "JSON", "Math", "Number", "Object", "RegExp", "String"
  ]
  const specialCharacters = [":", ",", "."];
  return new createParser(
    blueKeywords,
    purpleKeywords,
    yellowKeywords,
    greenKeywords,
    specialCharacters
  ).parse(code);
}

export default parseJs;