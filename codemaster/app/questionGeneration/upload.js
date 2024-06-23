import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const EMAIL = process.env.NEXT_PUBLIC_EMAIL;
const PASSWORD = process.env.NEXT_PUBLIC_PASSWORD;

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

export default async function upload(question, purpose, isVerified = true) {

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
      const format = part.format;
      const inputs = part.inputs;
      for (let j = 0; j < inputs.length; j++) {
        const data = inputs[j];
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
      const points = part.points;
      total_points += points.reduce((a, b) => a + b, 0);
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
      
      const format = part.format;
      const inputs = part.inputs;
      for (let j = 0; j < inputs.length; j++) {
        const data = inputs[j];
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
      const points = part.points;
      total_points += points.reduce((a, b) => a + b, 0);
      const { data: res, error } = await supabase.from("Freestyle").insert({
        question: question, format: format, inputs: inputs, points: points, part: partValue,
        code: part.code, pre_code: part.pre_code, post_code: part.post_code, function_name: part.function_name
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
    type: type, title: title, content: content, language: language, difficulty: difficulty, 
    source: source, parts: parts, points: total_points, verified: isVerified, purpose: purpose
  }).select();

  if (error) { console.error(error); return; }

  const question_id = res && res[0].id;
  console.log("Question with id: " + question_id + " uploaded successfully!");

  return question_id;
}

// upload(question);