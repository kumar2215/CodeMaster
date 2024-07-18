"use client";
import { createClient } from "@/utils/supabase/client";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import { toast } from "react-toastify";
import ProfilePic from "@/components/images/profilepic";
import convertDate from "@/app/utils/dateConversion/convertDateV2";

export default function ReviewVerification(params: any) {

  const id: string = params.id;
  const adminReviewing: string = params.admin;
  const userApplied: string = params.userApplied;
  const status: string = params.status;
  let review: any = params.review;

  const submitReview = async (content: string, status: string) => {
    const supabase = createClient();

    const review = { 
      written_by: adminReviewing,
      content,
      created_at: convertDate(new Date().toString()),
    };

    const msg = status === "approved"
      ? "Your application to become a verified user has been approved."
      : `Your application to become a verified user has been reviewed but not approved.`

    const new_user_type = status === "approved" ? "verified" : "user";

    const notification = {
      from: "Admin",
      message: msg,
      type: "View",
      link: `/verify/${id}`,
    }
    
    const { data, error } = await supabase.from("Users").select("notifications").eq("username", userApplied).single();
    if (error) { 
      console.error(error);
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }

    const notifications = data && data.notifications;
    notifications.push(notification);

    const res = await supabase.from("Users").update({notifications, user_type: new_user_type}).eq("username", userApplied);
    if (res.error) { 
      console.error(res.error);
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }

    const res2 = await supabase.from("Verifications").update({status, review}).eq("id", id);
    if (res2.error) { 
      console.error(res2.error);
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }

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
    {status === "pending" && review === null 
    ? <div className="w-full max-w-5xl flex flex-row mt-4">
      <form className="w-full bg-slate-50 p-3 gap-3">
        <div className="flex flex-row items-center focus:outline-none p-2 mb-2">
          <div className="flex flex-row gap-2"
            aria-haspopup="menu" aria-expanded="false" data-headlessui-state=""
            >
              <span id="navbar_user_avatar" className="relative ml-1 h-10 w-10">
                <ProfilePic username={adminReviewing} />
              </span>
              <div className="flex flex-col">
              <h1 className="text-gray-500 font-medium">{adminReviewing}</h1>
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
            <ProfilePic username={review.written_by} />
          </span>
          <div className="flex flex-col">
          <h1 className="text-gray-500 font-medium">{review.written_by}</h1>
          <h1>{review.created_at}</h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col pl-2 gap-2">
        <div className="flex flex-row gap-2 text-lg">
          <h1 className="font-semibold">Status: </h1>
          <h1 className={`font-semibold ${status === "approved" ? "text-green-500" : "text-red-500"}`}>{status.toUpperCase()}</h1>
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