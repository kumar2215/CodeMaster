"use client";
import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor(
  { language, code, setCode }: 
  { language: string, code: string, setCode: (code: string) => void })
{

  const fontSize = 15;
  const [lines, setLines] = useState(code.split("\n").length);
  const editorRef = useRef(null);

  useEffect(() => {
    setLines(code.split("\n").length);
  }, [code]);

  function handleMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  return (
    <Editor
      height={lines * 21 + "px"}
      width="100%"
      language={language === "c++" ? "cpp" : language}
      defaultValue={code}
      options={{
        fontSize: fontSize,
      }}
      onChange={(value) => setCode(value || "")}
      onMount={handleMount}
    />
  );

} 
