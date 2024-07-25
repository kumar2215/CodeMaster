import checkInUser from "./checkInUser";

export default async function sendNotification(to: string | string[], notification: any) {
  
  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }
  
  if (typeof to === "string") {
    const { data, error } = await supabase.from("Users").select("notifications").eq("username", to).single();
    if (error) { console.error(error); return; }

    const notifications = data.notifications || [];
    notifications.push(notification);
    const res = await supabase.from("Users").update({notifications: notifications}).eq("username", to);
    if (res.error) { console.error(res.error); return; }
    console.log("Notification sent successfully!");
  } else {
    for (const user of to) {
      await sendNotification(user, notification);
    }
  }
}