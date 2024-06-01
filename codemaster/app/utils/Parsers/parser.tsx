"use client";
import React, { useEffect } from "react";
import parsePython from "./pythonParser";
import parseCpp from "./cppParser";
import parseJava from "./javaParser";
import parseJs from "./jsParser";

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

export default function Parser(codeObject: any) {
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
    case "C++":
      return parseCpp(code);
    case "Java":
      return parseJava(code);
    case "JavaScript":
      return parseJs(code);
    default:
      return <div>{code}</div>;
  }
}