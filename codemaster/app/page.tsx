"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

// Load CodeEditor component dynamically to avoid SSR issues
const CodeEditor = dynamic(() => import('../component/CodeEditor'), { ssr: false });

export default function Home() {
  const [code, setCode] = useState('// Write your code here\n');
  const [output, setOutput] = useState('');
  console.log(code);
  console.log(code);

  const runCode = async () => {
    try {
      const response = await axios.post('/api/getResult', {
        code: code,
        question: 'binarysearch'
      });
      console.log(response.data.details)
      if (response.data.message == 'Some tests failed') {
        setOutput("Some tests failed" + JSON.stringify(response.data.details))
      } else {
      setOutput(response.data.message)
      }
    } catch (error) {
      if (error.response && error.response.data) {
          if (error.response.data.details) {
              setOutput(`Some tests failed: ${JSON.stringify(error.response.data.details, null, 2)}`);
          } else {
              setOutput(error.response.data.message, );
          }
      } else {
          // Fallback to the generic Axios error message
          console.log('API error:', error.message);
          setOutput(error.message);
      }
  }
  };

  return (
    <div>
      <h1>Online Code Editor</h1>
      <CodeEditor language="javascript" code={code} setCode={setCode} />
      <button onClick={runCode}>Run Code</button>
      <pre className={output == 'All tests passed' ? 'text-green-600' : 'text-red-600'}>{output}</pre>
    </div>
  );
}
