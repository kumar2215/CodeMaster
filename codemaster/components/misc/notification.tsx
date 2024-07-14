"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import _ from "lodash";
import remove_btn from "@/assets/remove_button_2.jpg";
import { toast } from "react-toastify";

export default function Notification(params: any) {

  const notification = params.notification;
  const username = params.username;
  const supabase = createClient();

  const message = notification.message;
  const from = notification.from;
  const type = notification.type;
  const link = notification.link;

  const router = useRouter();

  const deleteNotification = async () => {
    const { data, error } = await supabase.from("Users")
     .select("notifications")
     .eq("username", username)
     .single();

    if (error) { 
      console.error(error); 
      toast.error("Error deleting notification. Please try again.", {autoClose: 3000});
      return;
    }

    const notifications: any[] = (data && data.notifications) || [];
    const new_notifications = notifications.filter((item: any) => !_.isEqual(item, notification));

    const res = await supabase.from("Users")
      .update({notifications: new_notifications})
      .eq("username", username)
      .select();
    
    if (res.error) { 
      console.error(res.error);
      toast.error("Error deleting notification. Please try again.", {autoClose: 3000});
      return;
    }

    router.refresh();
    toast.success("Notification deleted successfully!", {autoClose: 3000});
  };

  return (
    <div className="flex flex-col relative group">
      <button 
      className="relative bottom-[-10px] left-[-8px] opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={deleteNotification}
      >
        <img src={remove_btn.src} className="w-4 h-4 rounded-full"/>
      </button> 
      <div className="w-full h-16 py-5 bg-green-200 shadow-md rounded-lg flex items-center justify-between px-4">
        <div className="flex flex-row gap-3">
          <div className="text-lg text-gray-500 font-semibold">{`From ${from}:`}</div>
          <div className="text-lg font-semibold">{message}</div>
        </div>
        <button className="flex items-center">
          <Link href={link} className="ml-4 text-base text-blue-500">{type}</Link>
        </button>
      </div>
    </div>
  );
}
