"use client";
import { useFieldArray, Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(
  () => import('../codeBoxes/CodeEditor'),
  { ssr: false }  // This component will only be imported on the client-side
);

export default function FreestyleForm({ part, control, register, parentIndex, removePart, watch, qnNum, language}) {

  const { fields: testcases, append: appendTestcase, remove: removeTestcase } = useFieldArray({
    control,
    name: `questions.${qnNum-1}.parts.${parentIndex}.inputs`
  });

  const { fields: parameters, append: appendParameter, remove: removeParameter } = useFieldArray({
    control,
    name: `questions.${qnNum-1}.parts.${parentIndex}.parameters`
  });
  
  const params = watch(`questions.${qnNum-1}.parts.${parentIndex}.parameters`, []);
  const allowedTypes = ['int', 'double','boolean', 'string', 'int[]', 'double[]', 'boolean[]', 'string[]'];
  
  return (
    <div className='w-full flex flex-col gap-y-4'>

      <div className='flex flex-row gap-2'>
        <button 
        className='bg-white border-black w-6 h-6 my-2' style={{borderWidth: "1px"}}
        onClick={() => removePart(parentIndex)}
        >
        - 
        </button>
        <h2 className='text-xl text-blue-600 pt-2'>{`(${part})`}</h2>
        <p className='text-xl pt-2'>Freestyle</p>
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
          className="hover:text-blue-500 hover:underline cursor-pointer pl-1"
        >this question</a>
        </p>
      </div>

      <div>
        <h2>Question:</h2>
        <textarea 
          className='w-full h-8 mt-2 pl-2 pt-1' {...register(`questions.${qnNum-1}.parts.${parentIndex}.question`)} />
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

      {/* Parameters field */}
      <h2>Main function parameters:</h2>
      <div className='w-5/12 flex flex-row justify-evenly'>
        <h2 className='pb-1 border-b-2'>Name</h2>
        <h2 className='pb-1 border-b-2'> Type</h2>  
      </div>
      {parameters.length > 0
      ? parameters.map((p, i) => {
          return (
          <div key={i} className='flex flex-row gap-4'>
            <button 
            className='bg-white border-black w-6 h-6' style={{borderWidth: "1px"}}
            onClick={() => removeParameter(i)} 
            >
            - 
            </button>
            <label className="w-44 leading-5" style={{borderWidth: "1.5px"}}>
              <input
              className='w-full pl-1'
              {...register(`questions.${qnNum-1}.parts.${parentIndex}.parameters.${i}.name`)}
              >
              </input>
            </label>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
              <select
              {...register(`questions.${qnNum-1}.parts.${parentIndex}.parameters.${i}.type`)}
              >
              {allowedTypes.map((type, i) => (
                <option key={i} value={type}>{type}</option>
              ))}
              </select>
            </label>
          </div>
        )})
      : null}

      <button className="btn btn-info mt-4 mr-2 mb-2" type="button" onClick={() => {
        appendParameter({ name: '', type: '' });
      }}>
      Add Parameter
      </button>
      
      {/* Testcases field */}
      <h2>Testcases:</h2>
      {params.length > 0
      ? testcases.map((item, index) => (
        <div key={item.id} >
          <div className='flex flex-row gap-2'>
            <button 
              className='bg-white border-black w-6 h-6 my-1' style={{borderWidth: "1px"}}
              onClick={() => removeTestcase(index)}
            >
              - 
            </button>
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
                className='input-info h-6 pl-1'
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
              className='input-info h-6 pl-1'
              />
            </label>
          </div>
          <div className='flex flex-row gap-2 my-2 ml-10'>
            <p>Points:</p>
            <label className="leading-5" style={{borderWidth: "1.5px"}}>
              <input
              {...register(`questions.${qnNum-1}.parts.${parentIndex}.points.${index}`,
              { required: "Points are required",
                validate: value => value >= 0 || "Points cannot be negative"
              })}
              type='number'
              className='input-info h-6 pl-1'
              />
            </label>
          </div>
        </div>
      ))
      : testcases.length > 0
      ? <p className='text-red-600'>Please enter the parameters first.</p>
      : null}
      
      <button className="btn btn-info mt-4 mr-2 mb-2" type="button" onClick={() => {
        const obj = {};
        params.forEach((p, i) => {
          if (p.name.trim() !== '') obj[p.name.trim()] = '';
        });
        appendTestcase(obj);
      }}>
      Add Testcase
      </button>
      
    </div>
  );
};