import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import question from "./sample2.json";

const envFile = fs.readFileSync("../../.env.local").toString();
const lines = envFile.split("\n");
const NEXT_PUBLIC_SUPABASE_URL = lines[0].split("=")[1];
const NEXT_PUBLIC_SUPABASE_ANON_KEY = lines[1].split("=")[1];
const EMAIL = lines[2].split("=")[1];
const PASSWORD = lines[3].split("=")[1];

const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function upload(question: any) {

  const { data, error: err } = await supabase.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD
  });
  if (err) { console.error(err); }

  const type = question.type;
  const title = question.title;
  const content = question.content;
  const language = question.language;
  const difficulty = question.difficulty;
  const source = question.source;
  const parts = question.parts;
  let total_points = 0;

  const { data: res1, error: err1 } = await supabase.from("Questions").select(`*`).eq("title", title).eq("language", language);
  if (err1) { console.error(err1); return; }
  if (res1 && res1.length > 0) {
    console.error("Question with same title and language already exists!");
    return;
  }

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const partValue = part.part;
    const question = part.question;
    const questionType = part.questionType;

    if (questionType === "Multiple-Responses") {
      const format: string[] = part.format;
      const inputs = part.inputs;
      for (let j = 0; j < inputs.length; j++) {
        const data: any = inputs[j];
        for (let k = 0; k < format.length; k++) {
          if (data[format[k]] === undefined) {
            console.error("Testcase format does not match the format of the question");
            return;
          }
        }
        const { data: res, error } = await supabase.from("Testcases").insert({data: data}).select();
        if (error) { console.error(error); return; }

        const testcase_id =  res && res[0].id;
        inputs[j] = testcase_id;
      }
      const points: number[] = part.points;
      total_points += points.reduce((a: number, b: number) => a + b, 0);
      const { data: res, error } = await supabase.from("Multiple-Responses").insert({
        part: partValue, question: question, format: format, inputs: inputs, points: points
      }).select();
      if (error) { console.error(error); return;}
      const part_id = res && res[0].id;
      parts[i] = {
        type: "Multiple-Responses",
        part_id: part_id
      }
    }

    else if (questionType === "Freestyle") {
      const code = part.code;
      const format: string[] = part.format;
      const inputs = part.inputs;
      for (let j = 0; j < inputs.length; j++) {
        const data: any = inputs[j];
        for (let k = 0; k < format.length; k++) {
          if (data[format[k]] === undefined) {
            console.error("Testcase format does not match the format of the question");
            return;
          }
        }
        const { data: res, error } = await supabase.from("Testcases").insert({data: data}).select();
        if (error) { console.error(error); return; }

        const testcase_id =  res && res[0].id;
        inputs[j] = testcase_id;
      }
      const points: number[] = part.points;
      total_points += points.reduce((a: number, b: number) => a + b, 0);
      const { data: res, error } = await supabase.from("Freestyle").insert({
        part: partValue, question: question, code: code, format: format, inputs: inputs, 
        points: points, function_name: part.functionName
      }).select();
      if (error) { console.error(error); return;}
      const part_id = res && res[0].id;
      parts[i] = {
        type: "Freestyle",
        part_id: part_id
      }
    }

    else if (questionType === "MCQ") {
      const options = part.options;
      const points = part.points;
      total_points += points;
      const expected = part.expected;
      const { data: res, error } = await supabase.from("MCQ").insert({
        part: partValue, question: question, options: options, points: points, expected: expected
      }).select();
      if (error) { console.error(error); return; }
      const part_id = res && res[0].id;
      parts[i] = {
        type: "MCQ",
        part_id: part_id
      }
    }

    else if (questionType === "MRQ") {
      const options = part.options;
      const points = part.points;
      total_points += points;
      const expected = part.expected;
      const { data: res, error } = await supabase.from("MRQ").insert({
        part: partValue, question: question, options: options, points: points, expected: expected
      }).select();
      if (error) { console.error(error); return; }
      const part_id = res && res[0].id;
      parts[i] = {
        type: "MRQ",
        part_id: part_id
      }
    }
  }

  const { data: res, error } = await supabase.from("Questions").insert({
    type: type, title: title, content: content, language: language, 
    difficulty: difficulty, source: source, parts: parts, points: total_points
  }).select();
  if (error) { console.error(error); return; }
  const question_id = res && res[0].id;
  console.log("Question with id: " + question_id + " uploaded successfully!");
}

upload(question);