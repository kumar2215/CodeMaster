import Navbar from "@/components/misc/navbar";
import CommentSection from "@/components/pages/DiscussionPage";
import { createClient } from "@/utils/supabase/server";

export default async function Discussion({params: {id}}: {params: {id: string}}) {

  const thisLink = "/forum";

  const supabase = createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();
  const username = user?.user_metadata.username;

  const res = await supabase.from("Discussions").select("*").eq("id", id);
  if (res.error) { console.error(res.error) }
  const discussion = res.data && res.data[0];

  const res2 = await supabase.from("Comments").select().eq("id", discussion.head_comment);
  if (res2.error) { console.error(res.error) }
  const commentData = res2.data && res2.data[0];

  const posts: number = discussion.posts;

  return (
      <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
        <Navbar thisLink={thisLink} />
        <CommentSection discussionId={id} commentData={commentData} title={discussion.title} posts={posts} username={username} />
      </div>
  );
}