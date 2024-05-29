"use client";
import React, { useRef, useState } from 'react';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/hint/javascript-hint';
import { JSHINT } from 'jshint';

declare global {
  interface Window {
    JSHINT: typeof JSHINT;
  }
}
if (typeof window !== 'undefined') {
  window.JSHINT = JSHINT;
}

//Change the height in global.css file
const CodeEditor = ({ language, codeData }: { language: string, codeData: string }) => {
  const editorRef = useRef();
  const [code, setCode] = useState(codeData);

  return (
    <ControlledEditor
    className='h-full'
      value={code}
      options={{
        mode: language,
        lineNumbers: true,
        lint: true,
        linewrapping: true,
      }}
      onBeforeChange={(editor, data, value) => {
        setCode(value);
      }}
      editorDidMount={(editor) => {
        editorRef.current = editor;
      }}
    />
  );
};

export default CodeEditor;