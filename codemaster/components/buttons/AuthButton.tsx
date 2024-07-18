import { createClient } from "@/utils/supabase/server";
import ProfilePic from "@/components/images/profilepic";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthButton({ username }: { username?: string }) {

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return username ? (
      <div className="flex items-center gap-4">
        Hey, {username}!
        <div className="relative">
          <button className="flex items-center focus:outline-none" id="headlessui-menu-button-:r58:" type="button"
                  aria-haspopup="menu" aria-expanded="false" data-headlessui-state="">
            <Link href="/profile" className="relative flex items-center">
              <span id="navbar_user_avatar" className="relative w-6 h-6 ml-1">
                <ProfilePic username={username} />
              </span>
            </Link>
          </button>
        </div>
        <form className="flex items-center gap-4" action={signOut}>
          <button className="px-4 py-2 no-underline rounded-md bg-btn-background hover:bg-btn-background-hover">
            Logout
          </button>
        </form>
      </div>
  ) : (
      <Link
          href="/login"
          className="flex px-3 py-2 no-underline rounded-md bg-btn-background hover:bg-btn-background-hover"
      >
        Login
      </Link>
  );
}