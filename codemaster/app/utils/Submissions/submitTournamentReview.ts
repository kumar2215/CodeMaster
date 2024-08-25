"use client";
import { createClient } from "@/utils/supabase/client";

export default async function submitTournamentReview({id, username} : {id: string, username: string}) {

  const supabase = createClient();

  const res = await supabase
    .from("Tournaments")
    .select("*")
    .eq("id", id)
    .single();

  if (res.error) { 
    console.error(res.error); 
    return ["Something went wrong. Please try again.", "error"];
  }

  const tournamentData = res.data;
  const name: string = tournamentData.name;
  const created_by: string = tournamentData.created_by;
  const questionIds: string[] = tournamentData.questions;
  let allVerified: boolean = true;
  let allReviewed:  boolean = true;

  const admins = process.env.NEXT_PUBLIC_ADMINS?.split(",");
  if (admins && !admins.includes(username)) return ["You are not authorized to review this tournament.", "error"];
  if (admins && !admins.includes(created_by)) {
    for (const questionId of questionIds) {

      const res2 = await supabase
        .from("Questions")
        .select("parts, verified")
        .eq("id", questionId)
        .single();

      if (res2.error) { 
        console.error(res2.error); 
        return ["Something went wrong. Please try again.", "error"];
      }

      allVerified = allVerified && res2.data.verified;
      allReviewed = allReviewed && res2.data.parts.every((part: any) => part.reviewed);

      if (!allReviewed) {
        return ["Please review all questions before submitting.", "error"];
      }
    }
  }

  const msg = allVerified
    ? `Your tournament with the name ${name} has been approved. Verify and set a password to publish it.`
    : `Your tournament with the name ${name} has been reviewed but not approved.`;

  if (allReviewed) {
    let obj: any = { reviewed: true };
    if (allVerified) obj = {...obj, verified_by: username, verified_at: new Date() };

    const res3 = await supabase
      .from("Tournaments")
      .update(obj)
      .eq("id", id);

    if (res3.error) { 
      console.error(res3.error); 
      return ["Something went wrong. Please try again.", "error"];
    }
  }

  const notification = {
    from: "Admin",
    message: msg,
    type: "View",
    link: `/questions/tournament/${id}`,
  }
  
  const res4 = await supabase.from("Users").select("notifications").eq("username", created_by).single();
  if (res4.error) { 
    console.error(res4.error);
    return ["Something went wrong. Please try again.", "error"];
  }

  const notifications = res4.data && res4.data.notifications;
  notifications.push(notification);

  const res5 = await supabase.from("Users").update({notifications}).eq("username", created_by);
  if (res5.error) { 
    console.error(res5.error);
    return ["Something went wrong. Please try again.", "error"];
  }

  return ["Tournament review submitted successfully.", "success"];
}
