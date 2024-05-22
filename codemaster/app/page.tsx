import PremiumButton from "../components/PremiumButton";
import AuthButton from "../components/AuthButton";
import SignUpButton from "@/components/SignUpButton";
import Body from "@/components/Body";

export default async function Index() {

  return (
    <div className="flex-1 w-full flex flex-col gap-10">
      <nav 
        style={{
          display: "grid",
          gridTemplateColumns: "900px 200px",
          justifyContent: "center",
          borderBottom: "1px hsl(var(--foreground) / 0.1)",
        }}
        >
        <div className="w-sm flex items-start p-3 text-sm">
          {<PremiumButton />}
        </div>
        <div className="w-full max-w-5xl flex gap-5 items-center p-3 text-sm">
          {<AuthButton />}
          {<SignUpButton />}
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-10 opacity-0 px-3">
        <Body />
      </div>
    </div>
  );
}
