import React, { useRef } from 'react';
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
window.JSHINT = JSHINT;


const CodeEditor = ({ language, code, setCode }) => {
  const editorRef = useRef();

  return (
    <ControlledEditor
      value={code}
      options={{
        mode: language,
        lineNumbers: true,
        lint: true,
        linewrapping: true
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
