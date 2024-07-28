import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PremiumButton from "@/components/buttons/PremiumButton";
import AuthButton from "@/components/buttons/AuthButton";
import SignUpButton from "@/components/buttons/SignUpButton";
import Body from "@/components/pages/FrontPageBody";

export default async function Index() {

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/problemset");
  }

  return (
    <div className="flex flex-col flex-1 w-full gap-10 grow" style={{ backgroundColor: "#f9fafb" }}>
      <nav className="flex flex-row justify-center w-full border border-gray-300">
        <div className="flex flex-row justify-end w-full gap-5 p-3 text-sm lg:max-w-5xl">
          <AuthButton />
          <SignUpButton />
        </div>
      </nav>
    
      <div className="flex flex-row justify-center gap-10 px-3 opacity-0 animate-in">
        <Body />
      </div>
    </div>
  );
}
