"use server";
import { createClient } from "@/utils/supabase/server";

export default async function upload(question, purpose, username, isVerified = true) {

  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const type = question.type;
  const title = question.title;
  const content = question.content;
  const language = question.language;
  const difficulty = question.difficulty;
  const source = question.source;
  const parts = question.parts;
  let total_points = 0;
  const answers = {};

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
      const expected = inputs.map(input => input.expected);
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
        part: partValue, question: question, format: format, inputs: inputs, points: points, verified: isVerified
      }).select();
      if (error) { console.error(error); return;}
      const part_id = res && res[0].id;
      parts[i] = {
        type: "Multiple-Responses",
        part_id: part_id
      }
      answers[partValue] = {
        type: "Multiple-Responses",
        expected,
        points
      }
    }

    else if (questionType === "Freestyle") {
      
      // TODO: need to change this
      const parameters = part.parameters;
      const inputs = part.inputs;
      const expected = inputs.map(input => input.expected);
      for (let j = 0; j < inputs.length; j++) {
        const data = inputs[j];
        const { data: res, error } = await supabase.from("Testcases").insert({data: data}).select();
        if (error) { console.error(error); return; }

        const testcase_id =  res && res[0].id;
        inputs[j] = testcase_id;
      }
      const points = part.points;
      total_points += points.reduce((a, b) => a + b, 0);
      const { data: res, error } = await supabase.from("Freestyle").insert({
        question: question, parameters: parameters, inputs: inputs, points: points, part: partValue, code: part.code, 
        pre_code: part.pre_code, post_code: part.post_code, function_name: part.function_name, refactoring: part.refactoring,
        verified: isVerified
      }).select();
      if (error) { console.error(error); return;}
      const part_id = res && res[0].id;
      parts[i] = {
        type: "Freestyle",
        part_id: part_id
      }
      answers[partValue] = {
        type: "Freestyle",
        expected,
        points
      }
    }

    else if (questionType === "MCQ") {
      const options = part.options;
      const points = part.points;
      total_points += points;
      const expected = part.expected;
      const { data: res, error } = await supabase.from("MCQ").insert({
        part: partValue, question: question, options: options, points: points, expected: expected, verified: isVerified
      }).select();
      if (error) { console.error(error); return; }
      const part_id = res && res[0].id;
      parts[i] = {
        type: "MCQ",
        part_id: part_id
      }
      answers[partValue] = {
        type: "MCQ",
        expected,
        points
      }
    }

    else if (questionType === "MRQ") {
      const options = part.options;
      const points = part.points;
      total_points += points;
      const expected = part.expected;
      const { data: res, error } = await supabase.from("MRQ").insert({
        part: partValue, question: question, options: options, points: points, expected: expected, verified: isVerified
      }).select();
      if (error) { console.error(error); return; }
      const part_id = res && res[0].id;
      parts[i] = {
        type: "MRQ",
        part_id: part_id
      }
      answers[partValue] = {
        type: "MRQ",
        expected,
        points
      }
    }
  }

  const { data: res, error } = await supabase.from("Questions").insert({
    type: type, title: title, content: content, language: language, difficulty: difficulty, 
    source: source, parts: parts, points: total_points, verified: isVerified, purpose: purpose, created_by: username
  }).select();

  if (error) { console.error(error); return; }

  const question_id = res && res[0].id;
  console.log("Question with id: " + question_id + " uploaded successfully!");

  if (purpose === "general" && !isVerified) {
    
    const admins = process.env.NEXT_PUBLIC_ADMINS?.split(",");

    const notification = {
      from: username,
      message: `${username} has created a new question. Waiting for approval.`,
      type: "Approve",
      link: `/questions/${question_id}`
    }

    for (const admin of admins) {
      const { data, error } = await supabase.from("Users").select("notifications").eq("username", admin).single();
      if (error) { console.error(error); return; }

      const notifications = data.notifications || [];
      notifications.push(notification);
      const res = await supabase.from("Users").update({notifications: notifications}).eq("username", admin);
      if (res.error) { console.error(res.error); return; }
    }
  }

  return [question_id, answers];
}
