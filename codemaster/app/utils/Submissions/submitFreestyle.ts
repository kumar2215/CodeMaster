"use client";
import { createClient } from "@/utils/supabase/client";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

export default async function submitFreestyle(
  data: any,
  code: string,
  results: any[],
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setSubmitted: Dispatch<SetStateAction<boolean>>,
  setAccPoints: Dispatch<SetStateAction<number>>,
  setError: Dispatch<SetStateAction<string>>,
  submit: boolean = true
) {
  setIsLoading(true);
  submit && setSubmitted(true);

  const id: string = data.questionId;
  const part: string = data.part;
  const partId: string = data.partId;
  const username: string = data.username;
  const precode = data.precode;
  const postcode = data.postcode;
  const language: string = data.language;
  const parameters: any = data.parameters;
  const inputs: any[] = data.inputs;
  const points: number[] = data.points;
  const function_name: string = data.function_name;
  const class_name: string = data.class_name;
  const return_type: string = data.return_type;
  const run_configuration: any = data.run_configuration;

  let total = 0;
  for (let i = 0; i < inputs.length; i++) {
    total += points[i];
  }
  const answeredRight: string[] = Array(inputs.length).fill("Incorrect");
  let pointsAccumulated: number = 0;
  setAccPoints(pointsAccumulated);
  results.forEach((res: any, index: number) => {
    res[1]({actual: '', passed: '', error: ''});
  })

  const supabase = createClient();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  // check if code has imported restricted libraries
  let restrictedImports: string[] = [];
  if (language === "python") {
    restrictedImports = ['os', 'sys', 'subprocess', 'shutil', 'pickle', 'ctypes'];
  } else if (language === "javascript") {
    restrictedImports = ['child_process', 'fs', 'path', 'os', 'process', 'vm'];
  } else if (language === "java") {
    restrictedImports = ['java.io', 'java.lang.reflect', 'java.nio.file', 'java.lang.management'];
  } else if (language === "c++") {
    restrictedImports = ['<cstdlib>', '<cstdio>', '<unistd.h>', '<fstream>', '<fstream.h>', '<sys/types.h>', '<sys/stat.h>'];
  }

  for (const lib of restrictedImports) {
    if (code.includes(`import ${lib}`) || code.includes(`from ${lib}`) || 
        code.includes(`import '${lib}'`) || code.includes(`from '${lib}'`) ||
        code.includes(`import "${lib}"`) || code.includes(`from "${lib}"`) ||
        code.includes(`#include ${lib}`)) {
      toast.error(`Importing ${lib} is not allowed.`, {autoClose: 3000});
      setError("Code has restricted imports");
      setIsLoading(false);
      return;
    }
  }

  console.log("Sending code to server");
  try {
    const response = await fetch(`${SERVER_URL}/api/runCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        code,
        precode,
        postcode,
        language,
        parameters,
        function_name,
        class_name,
        return_type,
        run_configuration,
        testcases: inputs
      })
    });

    if (response.ok) {
      const data = await response.json();
      const result = data.results;
      console.log(result);

      if (result.errors) {
        setError(result.errors);
      } else {
        if (Array(results.length).fill(0).every((res: any, index: number) => result.tests[index] && result.tests[index].actual)) {
          result.tests.forEach((res: any, index: number) => {
            if (res.passed) {
              answeredRight[index] = "Correct";
              pointsAccumulated += points[index];
              result.tests[index].actual += " ✅"
            } else {
              result.tests[index].actual += " ❌"
            }
            results[index][1](result.tests[index]);
          });
        } else {
          Array(results.length).fill(0).forEach((res: any, index: number) => {
            if (!result.tests[index] || !result.tests[index].actual) {
              result.tests[index] = {...result.tests[index], "error": "Timeout error"};
            } else if (result.tests[index].passed) {
              answeredRight[index] = "Correct";
              pointsAccumulated += points[index];
              result.tests[index].actual += " ✅"
            } else if (result.tests[index].passed === false) {
              result.tests[index].actual += " ❌"
            }
            results[index][1](result.tests[index]);
          });
        }
        setAccPoints(pointsAccumulated);
        if (result.warnings) setError(result.warnings);
        else setError("");
      }

    } else {
      console.error(response.status, response.statusText);
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error("Server is down. Please report to admin.", {autoClose: 3000});
  }

  if (!submit) {
    setIsLoading(false);
    return true;
  }

  const res = await supabase.from("Users").select("*").eq("username", username);
  if (res.error) { console.error(res.error); }

  const XP: number = res.data && res.data[0].XP;
  const newXP: number = XP + pointsAccumulated;
  let questionsDone: any[] = res.data && res.data[0].questions_done;
  questionsDone = questionsDone ? questionsDone : [];

  const res2 = await supabase.from("Freestyle").select("*").eq("id", partId);
  if (res2.error) { console.error("Can't select from Frrestyle table\n" + res2.error); }

  let done_by = res2.data && res2.data[0].done_by;
  let avg_score = res2.data && res2.data[0].average_score;

  const index = questionsDone.findIndex(
    (question: { id: string }) => question.id === id);

  let questionDone: any = {};
  let partDone: any = {};

  const res3 = await supabase.from("Questions").select("*").eq("id", id);
  if (res3.error) { console.error(res3.error); }

  const questionData = res3.data && res3.data[0];
  const partsAvailable = questionData && questionData.parts.length;

  if (index !== -1) {
    questionDone = questionsDone[index];
    const index2 = questionDone.parts.findIndex((p : any) => p.part === part);
    if (index2 !== -1) {
      partDone = questionDone.parts[index2];
      const status: string[] = partDone.status;
      if (status.every((s: string) => s === "Correct")) {
        toast.info("You have already answered this correctly.", {autoClose: 3000});
        setIsLoading(false);
        return; 
      } 
      const prevScore = partDone.pointsAccumulated;
      for (let i = 0; i < partDone.status.length; i++) {
        if (partDone.status[i] !== "Correct") {
          partDone.status[i] = answeredRight[i];
        }
      }
      partDone.pointsAccumulated = pointsAccumulated + prevScore;
      questionDone.parts[index2] = partDone;
      avg_score = (avg_score * done_by + pointsAccumulated) / done_by;
      partDone.attempts += 1;
    }

    else {
      partDone = {
        part: part,
        partId: partId,
        type: "Freestyle",
        status: answeredRight,
        pointsAccumulated: pointsAccumulated,
        attempts: 1
      }
      avg_score = (avg_score * done_by + total) / (done_by + 1);
      done_by += 1;
      questionDone.parts.push(partDone);
      questionDone.pointsAccumulated = questionDone.parts.reduce((acc: number, p: any) => acc + p.pointsAccumulated, 0);
    }

    questionsDone[index] = questionDone;
  }

  else {
    questionDone = {
      id: id,
      parts: [
        {
          part: part,
          partId: partId,
          type: "Freestyle",
          status: answeredRight,
          pointsAccumulated: pointsAccumulated,
          attempts: 1
        }
      ],
      pointsAccumulated: pointsAccumulated,
      status: partsAvailable === 1 && answeredRight.every((s: string) => s === "Correct") ? "Completed" : "Attempted"
    }
    avg_score = (avg_score * done_by + pointsAccumulated) / (done_by + 1);
    done_by += 1;
    questionsDone.push(questionDone);
  }

  const Total = questionDone.parts.reduce((acc: number, p: any) => acc + p.pointsAccumulated, 0);
  questionDone.pointsAccumulated = Total;
  if (partsAvailable === questionDone.parts.length) {
    if (questionDone.parts.every((p: any) => p.status === "Correct" || (typeof p.status === "object" && p.status.every((s: string) => s === "Correct")))) {
      questionDone.status = "Completed";
      let completed_by = questionData.completed_by;
      let q_avg_score = questionData.average_score;
      q_avg_score = (q_avg_score * completed_by + Total) / (completed_by + 1);
      completed_by += 1;
      const res4 = await supabase.from("Questions")
      .update({ completed_by: completed_by, average_score: q_avg_score }).eq("id", id);
      if (res4.error) { console.error(res4.error);
      }
    }
  }

  const res5 = await supabase.from("Users").update({XP: newXP, questions_done: questionsDone}).eq("username", username);
  if (res5.error) { console.error(res5.error); }
  else { console.log("User stats updated") };
  
  const res6 = await supabase.from("Freestyle").update({done_by: done_by, average_score: avg_score}).eq("id", partId);
  if (res6.error) { console.error(res6.error); }
  else { console.log("Freestyle stats updated") };

  setIsLoading(false);
  setSubmitted(false);
  return true;
}
