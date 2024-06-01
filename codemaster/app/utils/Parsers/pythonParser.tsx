import createParser from "./createParser";

function parsePython(code: string) {
  const blueKeywords = [
    "and", "class", "def", "False", "global", "in", "is", "lambda",
    "None", "nonlocal", "not", "or", "True"
  ];
  const purpleKeywords = [
    "as", "assert", "break", "continue", "del", "if", "else", "elif",
    "except", "finally", "for", "from", "import", "pass", "raise", "return",
    "try", "while", "with", "yield", "self", "cls"
  ];
  const yellowKeywords = [
    "abs", "aiter", "all", "anext", "any", "ascii", "bin", "bool", "breakpoint", 
    "bytearray", "bytes", "callable", "chr", "classmethod", "compile", "complex",
    "delattr", "dict", "dir", "divmod", "enumerate", "eval", "exec", "filter",
    "float", "format", "frozenset", "getattr", "globals", "hasattr", "hash", "help",
    "hex", "id", "input", "int", "isinstance", "issubclass", "iter", "len", "list",
    "locals", "map", "max", "memoryview", "min", "next", "object", "oct", "open",
    "ord", "pow", "print", "property", "range", "repr", "reversed", "round", "set",
    "setattr", "slice", "sorted", "staticmethod", "str", "sum", "super", "tuple",
    "type", "vars", "zip"
  ];
  const greenKeywords = ["int", "float", "str", "bool", "list", "tuple", "set", "dict"];
  const specialCharacters = [":", ","];
  return new createParser(
    blueKeywords,
    purpleKeywords,
    yellowKeywords,
    greenKeywords,
    specialCharacters
  ).parse(code);
}

export default parsePython;