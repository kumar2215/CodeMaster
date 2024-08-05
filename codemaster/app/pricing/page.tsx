import checkInUser from "@/app/utils/Misc/checkInUser";
import PricingPage from "@/components/pages/PricingPage";

export default async function Pricing() {

  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.log(userData);
    return;
  }

  const user_email = userData.email;

  return (
    <div className="w-screen bg-gray-100">
      <PricingPage email={user_email} />
    </div>
  );
}