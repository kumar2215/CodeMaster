"use server";
import { createClient } from '@/utils/supabase/server';
import upload from '@/app/questionGeneration/upload';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function uploadData(formData, createdBy, type) {

  const name = formData.name;
  const questions = formData.questions;
  const deadlineEpoch = formData.deadline;
  const points = formData.points;

  const { data, error: err } = await supabase.auth.signInWithPassword({
    email: process.env.EMAIL,
    password: process.env.PASSWORD
  });
  if (err) { console.error(err); return false; }

  try {
  
    const deadlineTimestamptz = new Date(deadlineEpoch).toISOString();
    const questionIDs = [];

    const purpose = type === "Contests" ? "contest" : "tournament";
    const verified = type === "Contests";

    for (const question of questions) {
        const id = await upload(question, purpose, verified);
        questionIDs.push(id);
    }

    const { data, error } = await supabase
      .from(type)
      .insert([
        { 
          name: name,
          questions: questionIDs, 
          deadline: deadlineTimestamptz,
          created_by: createdBy,
          points: points
        }
      ])
      .single(); 

    if (error) console.error(`Error inserting into table ${type}:`, error.message);
    else { return true;}

  } catch (error) {
    console.error(`Error inserting into table ${type}:`, error.message);
    return false;
  }
}


export default async function submitForm(data, type) {

  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const username = user.user_metadata.username;

  let total_points = 0;
  result.questions.forEach((question) => {
    total_points += question.points;
    // console.log('Question:', question);
    // question.parts.forEach((part) => {
    //   console.log('Part:', part);
    // });
  });
  result.points = total_points;
  // console.log('processed form: ', result);
  return await uploadData(result, username, type);
}

