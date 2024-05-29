"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

const CodeEditor = dynamic(() => import('@/components/codeBoxes/CodeEditor'), { ssr: false });

export default function FreeStyle ({data}: {data: any}) {
  
  const id = data.id;
  const codeData = data.code;
  const inputs = data.inputs;
  const points = data.points;
  const function_name = data.function_name;
  const format = data.format;
  const source = data.source;
  
  const [code, setCode] = useState(codeData);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [failedTests, setFailedTests] = useState([]);
  
  const runCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/getResult', {
        code: code,
        questionId: id,
        testcases: inputs,
        function_name: function_name,
        format: format
      });
      console.log(response.data.details)
      if (response.data.message == 'Some tests failed') {
        setOutput("Some tests failed")
        setFailedTests(response.data.details)
      } else {
        setOutput(response.data.message)
        setFailedTests([])
        console.log(output)
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        if (error.response.data.details) {
          setOutput(`Something went wrong`);
        } else {
          setOutput(error.response.data.message);
        }
      } else {
        // Fallback to the generic Axios error message
        console.log('API error:', error.message);
        setOutput(error.message);
      }
    }
    setIsLoading(false);
  };
  return (
    <div className='w-full h-full'>
    <CodeEditor language="javascript" code={code} setCode={setCode} />
    { source.link
      ? <div className="text-lg font-medium leading-10">
      <p>source: 
      <a 
      href={source.src}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-blue-500 hover:underline cursor-pointer px-2"
      >{source.src}</a>
      </p>
      </div>
      : <div className="text-lg font-medium leading-10">source: {source.src}</div>
    }
    <div className="flex flex-row justify-between p-2 pl-4 mb-0">
      <button className="text-lg font-medium bg-blue-500 text-white p-2 rounded-lg" onClick={runCode}>
      { isLoading 
        ? <span className="loading loading-spinner w-10"></span>
        : <div className='flex justify-center'>Submit</div>
      }
      </button> 
      <span className="text-lg font-medium pr-5 pt-2">{`[${points.reduce((a: number, b: number) => a + b, 0)} points]`}</span>
    </div>            
    <div className={`max-w-full ml-2 whitespace-pre-wrap break-words ${output === 'All tests passed' ? 'text-green-600' : 'text-red-600'}`}>
    {
      failedTests.length > 0 ? (
        <div>
        <div>{output}</div>
        {
          failedTests.map((data: any, index: number) => ( // Add type assertion here
          <div key={index}>
          {`${JSON.stringify((data as any).test)} Got ${(data as any).result} instead`}
          </div>
        ))
      }
      </div>
    ) : (output)
    }
    </div>
    </div>
  );
}