"use client";
import { useState, useEffect } from 'react';
import { useFieldArray, Controller } from 'react-hook-form';
import AddButtonImage from "@/components/images/add_button";
import RemoveButton from '@/components/buttons/RemoveButton';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import gold_medal from "@/assets/gold_medal.jpg";
import silver_medal from "@/assets/silver_medal.jpg";
import bronze_medal from "@/assets/bronze_medal.jpg";

const CodeEditor = dynamic(
  () => import('@/components/codeBoxes/CodeEditor'),
  { ssr: false }  // This component will only be imported on the client-side
);

export default function FreestyleForm({ part, control, register, parentIndex, removePart, watch, qnNum, language, type}) {

  const { fields: testcases, append: appendTestcase, remove: removeTestcase } = useFieldArray({
    control,
    name: `questions.${qnNum-1}.parts.${parentIndex}.inputs`
  });

  const { fields: parameters, append: appendParameter, remove: removeParameter } = useFieldArray({
    control,
    name: `questions.${qnNum-1}.parts.${parentIndex}.parameters`
  });
  
  const params = watch(`questions.${qnNum-1}.parts.${parentIndex}.parameters`, []);
  const [types, setTypes] = useState(['int', 'double','boolean', 'string', 'int[]', 'double[]', 'boolean[]', 'string[]']);

  useEffect(() => {
    if (!language) return;

    if (language === "python") setTypes(['int', 'float','bool', 'str', 'tuple', 'list', 'set', 'dict']);
    else if (language === "javascript") {
      setTypes(['number','boolean', 'string', 'number[]', 'boolean[]', 'string[]']);
    }
    else if (language === "java") {
      setTypes(['int', 'double','boolean', 'char', 'String', 'int[]', 'double[]', 'boolean[]', 'char[]', 'String[]']);
    }
    else if (language === "c++") {
      setTypes(['int', 'double','bool', 'string', 'vector<int>', 'vector<double>', 'vector<bool>', 'vector<string>']);
    }
  }, [language]);

  return (
    <div className='flex flex-col w-full gap-y-4'>

      <div className='flex flex-row gap-2'>
        <RemoveButton remove={() => removePart(parentIndex)} style={{marginTop: "5px"}}/>
        <h2 className='pt-2 text-xl text-blue-600'>{`(${part})`}</h2>
        <p className='pt-2 text-xl'>Freestyle</p>
      </div>

      <div>
        The Freestyle part consists of only code and inputs/testcases to test the code. The parameters field is used to 
        specify the name of the parameters used in the main function. The testcases are the values of the arguments themselves.
        This part should only be used for the Debugging and Refactoring question types. For Debugging, there should be testcases
        that the given code fails on. For Refactoring, the code should pass all testcases. The code part consists of 3 parts:
        precode, usercode, and postcode. The precode and postcode are optional. The usercode is the code that the user sees and
        modifies and should contain the main function. The precode is the code that comes before the usercode and the postcode 
        is the code that comes after the usercode.
        <br />
        <p className='pt-2'>
        Eg.
        <a 
          href="/questions/9e645bf9-167a-465c-858c-8610e4bdab35"
          target="_blank"
          rel="noopener noreferrer"
          className="pl-1 cursor-pointer hover:text-blue-500 hover:underline"
        >this question</a>
        </p>
      </div>

      <div>
        <h2>Question:</h2>
        <textarea 
          className='w-full h-8 pt-1 pl-2 mt-2' {...register(`questions.${qnNum-1}.parts.${parentIndex}.question`)} />
      </div>
      
      <section className='flex flex-col gap-2'>
        <h2>Precode (optional) :</h2>
        <Controller
        name={`questions.${qnNum-1}.parts.${parentIndex}.precode`}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <CodeEditor
          language={language}
          code={field.value}
          setCode={field.onChange}
          />
        )}
        />
      </section>

      <section className='flex flex-col gap-2'>
        <h2>Usercode:</h2>
        <Controller
        name={`questions.${qnNum-1}.parts.${parentIndex}.code`}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <CodeEditor
          language={language}
          code={field.value}
          setCode={field.onChange}
          />
        )}
        />
      </section>

      <section className='flex flex-col gap-2'>
        <h2>Postcode (optional) :</h2>
        <Controller
        name={`questions.${qnNum-1}.parts.${parentIndex}.postcode`}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <CodeEditor
          language={language}
          code={field.value}
          setCode={field.onChange}
          />
        )}
        />
      </section>
      
      <Controller
      name={`questions.${qnNum-1}.parts.${parentIndex}.className`}
      control={control}
      render={({ field }) => (
        <div className='flex flex-col gap-2'>
          <h2>Main class name (used in usercode if any) :</h2>
          <label className="leading-5" style={{borderWidth: "1.5px"}}>
            <input className='w-full h-8 pl-2' {...field} required={language === "java"} />
          </label>
        </div>
      )}
      />

      <Controller
      name={`questions.${qnNum-1}.parts.${parentIndex}.functionName`}
      control={control}
      render={({ field }) => (
        <div className='flex flex-col gap-2'>
          <h2>Main function name (used in usercode) :</h2>
          <label className="leading-5" style={{borderWidth: "1.5px"}}>
            <input className='w-full h-8 pl-2' {...field} required={true} />
          </label>
        </div>
      )}
      />

      <Controller
      name={`questions.${qnNum-1}.parts.${parentIndex}.returnType`}
      control={control}
      render={({ field }) => (
        <div className='flex flex-row gap-4'>
          <h2>Main function return type :</h2>
          <select
          {...register(`questions.${qnNum-1}.parts.${parentIndex}.returnType`)}
          >
          {types.map((type, i) => (
            <option key={i} value={type}>{type}</option>
          ))}
          </select>
        </div>
      )}
      />

      {/* Parameters field */}
      <h2>Main function parameters:</h2>
      <div className='flex flex-row w-5/12 justify-evenly'>
        <h2 className='pb-1 border-b-2'>Name</h2>
        <h2 className='pb-1 border-b-2'> Type</h2>  
      </div>
      {parameters.length > 0
      ? language === "" 
      ? <p className='text-red-600'>Please enter the language first.</p>
      : parameters.map((p, i) => {
          return (
          <div key={i} className='flex flex-row gap-4'>
            <RemoveButton remove={() => removeParameter(i)} />
            <label className="leading-5 w-44" style={{borderWidth: "1.5px"}}>
              <input
              className='w-full pl-1'
              {...register(`questions.${qnNum-1}.parts.${parentIndex}.parameters.${i}.name`)}
              >
              </input>
            </label>
            <label className="w-24 leading-5" style={{borderWidth: "1.5px"}}>
              <select
              {...register(`questions.${qnNum-1}.parts.${parentIndex}.parameters.${i}.type`)}
              className='w-full pl-1'
              >
              {types.map((type, i) => (
                <option key={i} value={type}>{type}</option>
              ))}
              </select>
            </label>
          </div>
        )})
      : null}

      <button type="button" className="flex flex-row justify-between w-2/5 gap-2 mt-2" onClick={() => {
        appendParameter({ name: '', type: '' });
      }}>
        <AddButtonImage />
        <h1 className="w-full pt-1 text-lg font-medium text-white bg-green-400 rounded-lg hover:bg-green-700">Add Parameter</h1>
        <h1></h1>
      </button>
      
      {/* Testcases field */}
      <h2>Testcases:</h2>
      {params.length > 0
      ? testcases.map((item, index) => (
        <div key={item.id} >
          <div className='flex flex-row gap-2'>
            <RemoveButton remove={() => removeTestcase(index)} />
            <h2 className='pt-1'>Testcase {index+1}</h2>
          </div>
          {params.map((p, i) => {
            return (
            p.name.trim() !== '' &&
            <div key={i} className='flex flex-row gap-2 my-2 ml-10'>
              <p>{p.name}:</p>
              <label className="leading-5" style={{borderWidth: "1.5px"}}>
                <input
                {...register(`questions.${qnNum-1}.parts.${parentIndex}.inputs.${index}.${p.name}`, 
                { required: "Input is required" }
                )}
                className='h-6 pl-1 input-info'
                />
              </label>
            </div>
          )})}
          <div className='flex flex-row gap-2 my-2 ml-10'>
            <p>expected:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
              <input
              {...register(`questions.${qnNum-1}.parts.${parentIndex}.inputs.${index}.expected`, 
              { required: "Input is required" }
              )}
              className='h-6 pl-1 input-info'
              />
            </label>
          </div>
          {type !== "Refactoring" &&
          <div className='flex flex-row gap-2 my-2 ml-10'>
            <p>Points:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
              <input
              {...register(`questions.${qnNum-1}.parts.${parentIndex}.points.${index}`,
              { required: "Points are required",
                validate: value => value >= 0 || "Points cannot be negative"
              })}
              type='number'
              className='h-6 pl-1 input-info'
              />
            </label>
          </div>}
        </div>
      ))
      : testcases.length > 0
      ? <p className='text-red-600'>Please enter the parameters first.</p>
      : null}
      
      <button type="button" className="flex flex-row justify-between w-2/5 gap-2" onClick={() => {
        const obj = {};
        params.forEach((p, i) => {
          if (p.name.trim() !== '') obj[p.name.trim()] = '';
        });
        appendTestcase(obj);
      }}>
        <AddButtonImage />
        <h1 className="w-full pt-1 text-lg font-medium bg-green-400 rounded-lg hover:bg-green-700 text-slate-50">Add Testcase</h1>
        <h1></h1>
      </button>

      {/* Points used for top voted if refactoring */}
      {type === "Refactoring" &&
      <div className='flex flex-col gap-2 my-2'>
        <h2>Points awarded for top voted refactoring:</h2>
        <div className='flex flex-row gap-2'>
          <Image src={gold_medal} alt="gold medal" className="h-12 w-9"/>
          <h2 className='mt-2 font-bold' >:</h2>
          <label className="h-8 mt-2 leading-5" style={{borderWidth: "1.5px"}}>
          <input
          {...register(`questions.${qnNum-1}.parts.${parentIndex}.points.${0}`, 
          { required: "Points are required",
            validate: value => value >= 0 || "Points cannot be negative"
          })}
          type='number'
          className='h-[28px] pl-1 input-info'
          />
          </label> 
        </div>
        <div className='flex flex-row gap-2'>
          <Image src={silver_medal} alt="gold medal" className="h-12 w-9"/>
          <h2 className='mt-2 font-bold' >:</h2>
          <label className="h-8 mt-2 leading-5" style={{borderWidth: "1.5px"}}>
          <input
          {...register(`questions.${qnNum-1}.parts.${parentIndex}.points.${1}`, 
          { required: "Points are required",
            validate: value => value >= 0 || "Points cannot be negative"
          })}
          type='number'
          className='h-[28px] pl-1 input-info'
          />
          </label> 
        </div>
        <div className='flex flex-row gap-2'>
          <Image src={bronze_medal} alt="gold medal" className="h-12 w-9"/>
          <h2 className='mt-2 font-bold' >:</h2>
          <label className="h-8 mt-2 leading-5" style={{borderWidth: "1.5px"}}>
          <input
          {...register(`questions.${qnNum-1}.parts.${parentIndex}.points.${2}`, 
          { required: "Points are required",
            validate: value => value >= 0 || "Points cannot be negative"
          })}
          type='number'
          className='h-[28px] pl-1 input-info'
          />
          </label> 
        </div>
      </div>}
      
    </div>
  );
};