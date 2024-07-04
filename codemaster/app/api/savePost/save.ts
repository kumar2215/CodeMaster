"use server";
import { createClient } from "@/utils/supabase/server";

export default async function submitToDB(formData: FormData, topic: string) {
  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  const username = user?.user_metadata.username;

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const {data: res, error} = await supabase.from("Comments").insert({
    written_by: username,
    content: content
  }).select();
  if (error) { console.error(error); return false; }

  if (res) {
    const data = res[0];
    const {data: Data, error} = await supabase.from("Discussions").insert({
      created_at: data.created_at,
      created_by: data.written_by,
      head_comment: data.id,
      title: title,
      type: topic
    })
    if (error) { console.error(error); return false; }

    const res2 = await supabase.from("Users").select("*").eq("username", username).single();
    if (res2.error) { console.error(res2.error) }

    let comments_written = res2.data.comments_written;
    comments_written = comments_written !== null ? comments_written : [];
    comments_written.push(data.id);

    const res3 = await supabase.from("Users").update({comments_written: comments_written}).eq("username", username);
    if (res3.error) { console.error(res3.error) }

    return true;
  }
}