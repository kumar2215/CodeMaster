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
    <div className="flex flex-col flex-1 w-full gap-10 grow" style={{backgroundColor: "#f9fafb"}}>
      <nav 
        style={{
          display: "grid",
          gridTemplateColumns: "550px 550px",
          justifyContent: "center",
          border: "1px solid #e5e7eb",
        }}
        >
        <div className="flex justify-start w-full max-w-4xl p-3 text-sm">
          <PremiumButton />
        </div>
        <div className="flex justify-end w-full max-w-4xl gap-5 p-3 text-sm">
          <AuthButton />
          <SignUpButton />
        </div>
      </nav>

      <div className="flex flex-col flex-1 gap-10 px-3 opacity-0 animate-in">
        <Body />
      </div>
    </div>
  );
}
