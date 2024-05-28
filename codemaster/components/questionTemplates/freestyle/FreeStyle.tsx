"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';


const CodeEditor = dynamic(() => import('../../../components/codeBoxes/CodeEditor'), { ssr: false });



export default function FreeStyle ({data, codeData, testcase, id}: {data: any, codeData: any, testcase: any, id: any}) {

    const [code, setCode] = useState(codeData);
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [failedTests, setFailedTests] = useState([])

    const question = data[0].question
    const inputs = data[0].inputs
    const points = data[0].points
    const function_name = data[0].function_name
    const format = data[0].format


    const runCode = async () => {
        setIsLoading(true);
        try {
          const response = await axios.post('/api/getResult', {
            code: code,
            question: id,
            testcase: testcase,
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
        <div className='w-80vw flex flex-col bg-blue-200 rounded-2xl overflow-hidden'>
          <section className='w-full'>
            <div className='text-center'>Question</div>
            <div className='ml-4 flex'>{question}</div>
          </section>
          <section className='w-full h-full'>
            <CodeEditor language="javascript" code={code} setCode={setCode} />
            <button className="btn btn-success ml-2" onClick={runCode}>
                { isLoading ?  <span className="loading loading-spinner w-10"></span>
                    :<div className='w-10 flex justify-center'>Submit</div>
                }
            </button>            
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
                ) : (
                  output
                )
              }
            </div>
          </section>
        </div>
      );
      
    }