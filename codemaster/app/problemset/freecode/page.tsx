"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

const CodeEditor = dynamic(() => import('../../../components/CodeEditor'), { ssr: false });

export default function FreeCode({id}) {
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
        <div className='w-full flex h-screen'>
          <section className='w-4/12'>
            <div className='text-center'>Title</div>
            <div className='ml-4'>Question: Hello make a binary search. Given [1,2,4]  Your answer should be 2 Hello make a binary search. Given [1,2,4]  Your answer should be 
            Hello make a binary search. Given [1,2,4]  Your answer should be Hello make a binary search. Given [1,2,4]  Your answer should be 
            </div>

          </section>
          <section className='w-8/12 h-full'>
          <button onClick={runCode}>Run Code</button>
            <CodeEditor language="javascript" code={code} setCode={setCode} />
            <pre className={output == 'All tests passed' ? 'text-green-600' : 'text-red-600'}>{output}</pre>
          </section>

        </div>
      );
    }