import PremiumButton from "@/components/buttons/PremiumButton";
import AuthButton from "@/components/buttons/AuthButton";
import SignUpButton from "@/components/buttons/SignUpButton";
import Body from "@/components/pages/FrontPageBody";

export default async function Index() {

  return (
    <div className="flex-1 grow w-full flex flex-col gap-10">
<nav className="grid grid-cols-1 md:grid-cols-2 justify-center border border-gray-300 p-4">

        <div className="w-full max-w-4xl flex justify-start p-3 text-sm">
          <PremiumButton />
        </div>
        <div className="w-full max-w-4xl flex justify-end gap-5 p-3 text-sm">
          <AuthButton />
          <SignUpButton />
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-10 opacity-0 px-3">
        <Body />
      </div>
    </div>
  );
}
