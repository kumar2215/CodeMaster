import createParser from "./createParser";

function parseCpp(code: string) {
  const blueKeywords = [
    "alignas", "alignof", "asm", "auto", "bool", "catch", "char",
    "char16_t", "char32_t", "class", "const", "const_cast", "constexpr",
    "decltype", "double", "dynamic_cast", "else", "enum",
    "explicit", "export", "extern", "false", "float", "friend",
    "inline", "int", "long", "mutable", "namespace", "noexcept", "nullptr",
    "operator", "private", "protected", "public", "register", "reinterpret_cast",
    "return", "short", "signed", "sizeof", "static", "static_assert", "static_cast",
    "struct", "template", "this", "thread_local", "true", "try",
    "typedef", "typeid", "typename", "union", "unsigned", "using", "virtual", "void",
    "volatile", "wchar_t"
  ];
  const purpleKeywords = [
    "#define", "#elif", "#else", "#endif", "#error", "#if", "#ifdef", "#ifndef",
    "#include", "#line", "#pragma", "#undef", "using", "new", "delete", "throw",
    "for", "while", "do", "if", "else", "switch", "case", "default", "goto", "continue"
  ];
  const yellowKeywords = [
    "main", "cin", "cout", "endl"
  ];
  const greenKeywords = [
    "std", "vector", "string", "algorithm", "queue", "stack", "priority_queue",
    "map", "set", "unordered_map", "unordered_set", "pair", "make_pair", "iterator", "begin",
    "end", "next", "prev", "advance", "distance", "sort", "reverse", "lower_bound", "upper_bound",
    "equal_range", "find", "count", "count_if", "accumulate", "for_each", "transform", "copy",
    "copy_if", "copy_n", "copy_backward", "move", "move_backward", "fill", "fill_n", "generate"
  ];
  const specialCharacters = [":", ",", "<", ">"];
  return new createParser(
    blueKeywords,
    purpleKeywords,
    yellowKeywords,
    greenKeywords,
    specialCharacters
  ).parse(code);
}

export default parseCpp;