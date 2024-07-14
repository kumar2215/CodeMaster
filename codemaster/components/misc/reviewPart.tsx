"use client";
import { createClient } from "@/utils/supabase/client";
import { SubmitButton } from "@/components/buttons/submit-button";
import convertDate from "@/app/utils/dateConversion/convertDateV2";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ReviewPart({username, partData, questionType} : {username: string, partData: any, questionType: string}) {

  const alrVerified = partData.verified;
  const review = partData.review;

  const router = useRouter();

  const submitReview = async (content: string, status: string) => {
    const supabase = createClient();

    const res = await supabase.from("Comments").insert({content, written_by: username}).select();
    if (res.error) { 
      console.error(res.error);
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }

    const commentId = res.data && res.data[0].id;

    const verified = status === "approved";
    const review = { status, commentId };

    const partId = partData.partId;
    const questionId = partData.questionId;

    const res2 = await supabase.from(questionType).update({verified, review}).eq("id", partId);
    if (res2.error) { 
      console.error(res2.error);
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }

    const res3 = await supabase.from("Questions").select(`*`).eq("id", questionId).single();
    if (res3.error) { 
      console.error(res3.error);
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }

    const parts = res3.data && res3.data.parts;
    const idx = parts.findIndex((p: any) => p.part_id === partId);
    parts[idx].verified = verified;
    parts[idx].reviewed = true;

    const allVerified = parts.every((part: any) => part.verified);
    const allReviewed = parts.every((part: any) => part.reviewed);

    const res4 = await supabase.from("Questions").update({parts, verified: allVerified}).eq("id", questionId);
    if (res4.error) { 
      console.error(res4.error);
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }

    if (!partData.partOfCompetition && allReviewed) {
      const title = res3.data && res3.data.title;
      const created_by = res3.data && res3.data.created_by;

      const msg = allVerified 
        ? `Your question with title "${title}" has been approved.` 
        : `Your question with title "${title}" has been reviewed but not approved.`

      const notification = {
        from: "Admin",
        message: msg,
        type: "View",
        link: `/questions/${questionId}`,
      }
      
      const res5 = await supabase.from("Users").select("notifications").eq("username", created_by).single();
      if (res5.error) { 
        console.error(res5.error);
        toast.error("Something went wrong. Please try again.", {autoClose: 3000});
        return;
      }

      const notifications = res5.data && res5.data.notifications;
      notifications.push(notification);

      const res6 = await supabase.from("Users").update({notifications}).eq("username", created_by);
      if (res6.error) { 
        console.error(res6.error);
        toast.error("Something went wrong. Please try again.", {autoClose: 3000});
        return;
      }
    }

    router.refresh();
    toast.success("Review submitted successfully!", {autoClose: 3000});
  }

  const reject = async (formData: FormData) => {
    await submitReview(formData.get("content") as string, "rejected");
  }

  const approve = async (formData: FormData) => {
    await submitReview(formData.get("content") as string, "approved");
  }

  return (
    <div>
    {!alrVerified && review === null 
    ? <div className="w-full max-w-5xl flex flex-row mt-4">
      <form className="w-full bg-slate-50 p-3 gap-3">
        <div className="flex flex-row items-center focus:outline-none p-2 mb-2">
          <div className="flex flex-row gap-2"
            aria-haspopup="menu" aria-expanded="false" data-headlessui-state=""
            >
              <span id="navbar_user_avatar" className="relative ml-1 h-10 w-10">
              <img src={`https://api.dicebear.com/8.x/personas/svg?seed=${username}`} alt="avatar"
              className="h-full w-full rounded-full object-cover"/>
              </span>
              <div className="flex flex-col">
              <h1 className="text-gray-500 font-medium">{username}</h1>
              <h1>{convertDate(new Date().toString())}</h1>
              </div>
            </div>
        </div>
        <textarea 
          className="w-full rounded-md px-2 py-2 bg-inherit border"
          style={{height: "150px"}}
          name="content"
          placeholder="Write your review here..."
          required
        />
        <div className="w-full flex flex-row justify-between">
          <SubmitButton
            formAction={reject}
            className="w-1/6 bg-red-400 border border-foreground/20 rounded-md px-4 py-2 font-semibold text-foreground mt-2"
            pendingText="Reviewing..."
          >Reject
          </SubmitButton>

          <SubmitButton
            formAction={approve}
            className="w-1/6 bg-green-400 border border-foreground/20 rounded-md px-4 py-2 font-semibold text-foreground mt-2"
            pendingText="Approving..."
            >Approve
          </SubmitButton>
        </div>
      </form>
    </div>
  : review && 
    <div className="w-full flex flex-col bg-white p-3 gap-3 border-2">
      <div className="flex flex-row items-center focus:outline-none p-2 justify-between border-b-2 border-gray-300">
        <div className="flex flex-row gap-2"
        aria-haspopup="menu" aria-expanded="false" data-headlessui-state=""
        >
          <span id="navbar_user_avatar" className="relative ml-1 h-10 w-10">
          <img src={`https://api.dicebear.com/8.x/personas/svg?seed=${review.written_by}`} alt="avatar"
          className="h-full w-full rounded-full object-cover"/>
          </span>
          <div className="flex flex-col">
          <h1 className="text-gray-500 font-medium">{review.written_by}</h1>
          <h1>{convertDate(review.created_at)}</h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col pl-2 gap-2">
        <div className="flex flex-row gap-2 text-lg">
          <h1 className="font-semibold">Status: </h1>
          <h1 className={`font-semibold ${review.status === "approved" ? "text-green-500" : "text-red-500"}`}>{review.status.toUpperCase()}</h1>
        </div>

        <div className="flex flex-row gap-2">
          <h1 className="font-semibold">Comment: </h1>
          <h1>{review.content}</h1>
        </div>
      </div>
    </div>
  }
  </div>
  );
}