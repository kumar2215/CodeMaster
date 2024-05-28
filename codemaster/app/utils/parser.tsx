"use client";
import React, { useEffect } from "react";

function interceptKeys(evt: any) {
  evt = evt || window.event; // IE support
  const c = evt.keyCode;
  const ctrlDown = evt.ctrlKey || evt.metaKey; // Mac support

  if (ctrlDown && evt.altKey) return true;

  // Check for ctrl+c, v and x
  if (ctrlDown && (c === 67 || c === 86 || c === 88)) {
    alert("No cheating allowed!");
    evt.preventDefault();
    return false;
  }

  // Otherwise allow
  return true;
}

function parsePython(code: string) {
  const lines = code.split("\n");
  const brackets = ["(", ")", "{", "}", "[", "]"];
  const specialCharacters = brackets.concat([":", ","]);
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

  return (
    <div className="pl-4" onKeyDown={interceptKeys} onContextMenu={() => false}>
    {lines.map((line: string, index: number) => {
    let indent = 0;
    line.split("    ").forEach((part: string) => {if (part === "") {indent++;}});
    let newLine = line;
    for (let i = 0; i < specialCharacters.length; i++) {
      newLine = newLine.replaceAll(specialCharacters[i], ` ${specialCharacters[i]} `);
    }
    const tokens = newLine.split(" ");
    return (
      <div key={index} className={`flex flex-row`} >
      {
        tokens.map((token: string, index: number) => {
          let color = "text-black";
          if (blueKeywords.includes(token)) {color = "text-blue-600";}
          else if (purpleKeywords.includes(token)) {color = "text-purple-600";}
          else if (greenKeywords.includes(token)) {color = "text-green-600";}
          else if (yellowKeywords.includes(token)) {color = "text-yellow-600";}
          else if (brackets.includes(token)) {color = "text-red-600";}
          return (
            <span key={index} className={`${color} 
            ${specialCharacters.includes(token) || specialCharacters.includes(tokens[index+1]) ? "" : "pr-2"}`}>{token}</span>
          );
        })
      }
      </div>);
    })}
    </div>
  );
}

export default function Parser(codeObject: any) { // for Python code
  const code = codeObject.code;
  const language = codeObject.language;

  useEffect(() => {
    document.addEventListener('keydown', interceptKeys);
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());

    return () => {
      document.removeEventListener('keydown', interceptKeys);
      document.removeEventListener('contextmenu', (e) => e.preventDefault());
      document.removeEventListener('dragstart', (e) => e.preventDefault());
    };
  }, []);

  switch (language) {
    case "Python":
      return parsePython(code);
    default:
      return <div>{code}</div>;
  }
}