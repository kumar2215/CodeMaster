"use server";
import { createClient } from '@/utils/supabase/server';
import upload from '@/app/api/uploadQuestion/upload';
import sendNotification from '@/app/utils/Misc/sendNotification';

const supabase = createClient();

async function uploadData(formData, createdBy, type) {

  const name = formData.name;
  const questions = formData.questions;
  const deadlineEpoch = formData.deadline;
  const points = formData.points;

  try {
  
    const deadlineTimestamptz = new Date(deadlineEpoch).toISOString();
    const questionIDs = [];
    const answers = [];

    const purpose = type === "Contests" ? "contest" : "tournament";
    const verified = type === "Contests";

    for (const question of questions) {
      const [id, answer] = await upload(question, purpose, createdBy, verified);
      if (!id) return [false, "Form has already been submitted."];
      questionIDs.push(id);
      answers.push(answer);
    }

    const { data, error } = await supabase
      .from(type)
      .insert([
        { 
          name: name,
          questions: questionIDs, 
          answers: answers,
          deadline: deadlineTimestamptz,
          created_by: createdBy,
          points: points
        }
      ])
      .select(); 

    if (error) {
      console.error(`Error inserting into table ${type}:`, error.message); 
      return [false, "Something went wrong. Please try again later."];
    }; 

    if (purpose === "tournament") {

      const admins = process.env.NEXT_PUBLIC_ADMINS?.split(",");

      const notification = {
        from: createdBy,
        message: `${createdBy} has created a new tournament. Waiting for approval.`,
        type: "Approve",
        link: `/questions/tournament/${data[0].id}`
      }

      await sendNotification(admins, notification);
    }

    return [true, ""];

  } catch (error) {
    console.error(`Error inserting into table ${type}:`, error.message);
    return [false, "Something went wrong. Please try again later."];
  }
}


export default async function submitForm(result, type) {

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
  });
  result.points = total_points;

  return await uploadData(result, username, type);
}

