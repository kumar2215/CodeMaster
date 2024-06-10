import setProfilePic from "@/app/profilepic/setProfilePic";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const username = user?.user_metadata.username;
  if (username) {
    const res = await supabase.from("Users").select('*').eq("username", username);
    if (res.error) { console.error(res.error); }
    if (res.data?.length === 0) {
      const res2 = await supabase.from("Users").insert({username: username, email: user?.email});
      if (res2.error) { console.error(res2.error); }
    }
  }

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  // const setProfilePic = async () => {
  //   "use server";
  //   return alert("This feature is not yet implemented");

  // const supabase = createClient();
  // await supabase.auth.update({
  //   data: { avatar_url: "https://assets.leetcode.com/users/default_avatar.jpg" },
  // });
  // }

  return user ? (
      <div className="flex items-center gap-4">
        Hey, {user.user_metadata.username}!
        <form className="flex grow items-center gap-4" action={setProfilePic}>
          <div className="relative">
            <button className="flex items-center focus:outline-none" id="headlessui-menu-button-:r58:" type="button"
                    aria-haspopup="menu" aria-expanded="false" data-headlessui-state="">
              <span id="navbar_user_avatar" className="relative ml-1 h-6 w-6">
              <img src={`https://api.dicebear.com/8.x/personas/svg?seed=${username}`} alt="avatar"
                   className="h-full w-full rounded-full object-cover"/>
              </span>
            </button>
          </div>
        </form>
        <form className="flex items-center gap-4" action={signOut}>
          <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
            Logout
          </button>
        </form>
      </div>
  ) : (
      <Link
          href="/login"
          className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Login
      </Link>
  );
}