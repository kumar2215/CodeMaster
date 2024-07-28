import { createClient } from "@/utils/supabase/server";
import PremiumButton from "@/components/buttons/PremiumButton";
import AuthButton from "@/components/buttons/AuthButton";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Navbar({thisLink, style}: {thisLink: string, style?: any}) { // need to remove ? after style

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const username = user.user_metadata.username;
  let numNotifications = 0;

  if (username) {
    const res = await supabase.from("Users").select('*').eq("username", username);
    if (res.error) { console.error(res.error); }
    if (res.data?.length === 0) {
      const avatar = {
        url: `https://api.dicebear.com/8.x/personas/svg?seed=${username}`,
        location: null
      }
      const res2 = await supabase.from("Users").insert({username: username, email: user?.email, avatar});
      if (res2.error) { console.error(res2.error); }
    } else {
      numNotifications = res.data && res.data[0].notifications && res.data[0].notifications.length;
    }
  }

  function createListElement(link: string, title: string) {

    const className = link === thisLink
      ? "relative flex items-center text-xl cursor-pointer font-medium py-4" 
      : "relative flex items-center hover:text-xl cursor-pointer hover:font-medium";
  
    return (
      <li className="relative flex items-center h-full text-base">
        <Link 
        className={className} 
        style={link == thisLink ? {borderBottom: "2px solid black"} : {}} 
        href={link}
        >
          {title}
        </Link>
        {link === "/profile" && numNotifications > 0 &&
        <div className="w-4 h-4 mb-4 ml-1 text-center bg-red-300 rounded-full">
          <p className="text-[0.75rem] leading-4 font-semibold">{numNotifications}</p>
        </div>}
      </li>
    );
  }

  return (
    <div className="w-full" style={style}>
      <nav className="container flex justify-center w-full mx-auto border-gray-300">
        <div className="flex flex-col w-full lg:flex-row lg:max-w-6xl">

          <ul className="flex flex-col items-center justify-center w-full gap-6 lg:justify-start lg:flex-row">

            <div className="flex items-center justify-center w-full gap-6 p-0 mt-2 lg:justify-start lg:mt-0">
              {createListElement("/problemset", "Problems")}
              {createListElement("/contests", "Contests")}
            </div>

            <div className="flex items-center justify-center w-full gap-6 p-0 lg:justify-start">

              {createListElement("/tournaments", "Tournaments")}
              {createListElement("/leaderboards", "Leaderboards")}

            </div>
            
            <div className="flex items-center justify-center w-full gap-6 p-0 lg:justify-start">
              {createListElement("/forum", "Forum")}
              {createListElement("/profile", "Profile")}
              {createListElement("/others", "Others")}
            </div>

          </ul>

          <div className="flex items-center justify-center w-full gap-3 p-3 text-sm lg:justify-end">
            <AuthButton username={username} />
            <PremiumButton />
          </div>
        </div>
      </nav>
    </div>
  );
}