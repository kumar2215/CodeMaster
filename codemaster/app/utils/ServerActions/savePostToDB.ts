"use server";
import {createClient} from "@/utils/supabase/server";

export default async function submitToDB(formData: FormData, topic: string) {
  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const {data: res, error} = await supabase.from("Comments").insert({
    written_by: user?.user_metadata.username,
    content: content
  }).select();
  if (error) { console.error(error); return false; }
  if (res) {
    const data = res[0];
    const {data: res2, error} = await supabase.from("Discussions").insert({
      created_at: data.created_at,
      created_by: data.written_by,
      head_comment: data.id,
      title: title,
      type: topic
    })
    if (error) { console.error(error); return false; }
    return true;
  }
}