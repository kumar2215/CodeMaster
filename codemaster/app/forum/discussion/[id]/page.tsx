import Navbar from "@/components/misc/navbar";
import CommentSection from "@/components/pages/DiscussionPage";
import checkInUser from "@/app/utils/Misc/checkInUser";


export default async function Discussion({params: {id}}: {params: {id: string}}) {

  const thisLink = "/forum";

  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }

  const preferences = userData.preferences;

  const res = await supabase.from("Discussions").select("*").eq("id", id).single();
  if (res.error) { console.error(res.error) }
  const discussion = res.data;

  const res2 = await supabase.from("Comments").select().eq("id", discussion.head_comment).single();
  if (res2.error) { console.error(res.error) }
  const commentData = res2.data;

  const posts: number = discussion.posts;

  return (
      <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
        <Navbar thisLink={thisLink} style={preferences.header} />
        <CommentSection discussionId={id} commentData={commentData} title={discussion.title} posts={posts} userData={userData} />
      </div>
  );
}