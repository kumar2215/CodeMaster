import { createClient } from "@/utils/supabase/server";
import React from 'react'
import Freestyle from './FreeStyle'
import test from "node:test";

interface data {
    question: string;
    inputs: string[];
    points: number[];
    function_name: string;
    format: string[];
}

export default async function FreeStylePage ({ FreestyleID, code } : { FreestyleID: string, code:string }) {
  const supabase = createClient();

  const { data: data, error } = await supabase
  .from('Freestyle')
  .select('question, inputs, points, function_name, format')
  .eq('id', FreestyleID); 



  const inputs = data![0].inputs
  const testcase = []

  for (const id of inputs) {
    const { data, error } = await supabase
    .from('Testcases')
    .select('data')
    .eq('id', id); 
    testcase.push(data![0].data);
  }

  if (error) {
    console.error(error);
  }


  return (
    <div className="w-full">
      <Freestyle data={data} codeData={code} testcase={testcase} id={FreestyleID}></Freestyle>
    </div>
  )
}
