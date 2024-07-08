"use server";
import { createClient } from '@/utils/supabase/server';
import upload from '@/app/api/uploadQuestion/upload';

const supabase = createClient();

export async function uploadData(formData, createdBy, type) {

  const name = formData.name;
  const questions = formData.questions;
  const deadlineEpoch = formData.deadline;
  const points = formData.points;

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

    if (error) {
      console.error(`Error inserting into table ${type}:`, error.message); 
      return false;
    }; 

    if (purpose === "tournament") {
      const res = await supabase.from("Users").select("username").eq("user_type", "admin");
      if (res.error) { console.error(res.error); return false; }

      const res2 = await supabase.from("Notifications").insert({
        from: createdBy,
        to: res.data,
        message: `${createdBy} has created a new tournament. Waiting for approval.`,
        action: {
          type: "Approve",
          link: `/admin/${type}/${data.id}`
        }
      })
      if (res2.error) { console.error(res2.error); return false; }
    }

    return true;

  } catch (error) {
    console.error(`Error inserting into table ${type}:`, error.message);
    return false;
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

