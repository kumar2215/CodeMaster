import Navbar from "@/components/misc/navbar";
import ReviewVerification from "@/components/misc/reviewVerification";
import checkInUser from "@/app/utils/Misc/checkInUser";
import { redirect } from "next/navigation";

const thisLink = "/others";

export default async function Verify({params: {id}}: {params: {id: string}}) {

  const [supabase, userData] = await checkInUser();
  if (supabase === null) {
    console.error(userData);
    return;
  }

  const username = userData.username;
  const preferences = userData.preferences;

  const { data, error } = await supabase.from("Verifications").select("*").eq("id", id);
  if (error) { console.error(error) }

  if (!data) {
    redirect("/empty");
  }

  if (data?.length === 0) {
    return (
      <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
        <Navbar thisLink={thisLink} style={preferences.header} />
        <h1 className="text-xl text-red-600">Invalid verification link</h1>
      </div>
    );
  }

  const verification = data && data[0];
  const userApplied = verification?.user;
  const verificationData = verification?.verification_data;
  const publicFileUrl = verificationData?.proofOfRole.publicUrl;

  const status = verification?.status;
  const review = verification?.review;

  return (
    <div className="flex flex-col items-center flex-1 w-full gap-10" style={preferences.body}>
      <Navbar thisLink={thisLink} style={preferences.header} />
      <h2 className="pt-2 text-4xl">Application details</h2>

      <div className="flex flex-col w-full max-w-5xl gap-4">
        <div className='flex flex-col gap-5 p-5 bg-gray-200 rounded-lg'>

          <div className="flex flex-row gap-2">
            <p className='text-lg font-semibold'>User who applied:</p>
            <p className='text-lg'>{userApplied}</p>
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2">
              <p className='text-lg font-semibold'>Firstname:</p>
              <p className='text-lg'>{verificationData.firstName}</p>
            </div>
            
            <div className="flex flex-row gap-2">
              <p className='text-lg font-semibold'>Lastname:</p>
              <p className='text-lg'>{verificationData?.lastName}</p>
            </div>

            <div></div>
          </div>

          <div className="flex flex-row gap-2">
            <p className='text-lg font-semibold'>Email:</p>
            <p className='text-lg'>{verificationData?.email}</p>
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2">
              <p className='text-lg font-semibold'>Organization:</p>
              <p className='text-lg'>{verificationData?.organizationName}</p>
            </div>

            <div className="flex flex-row gap-2">
              <p className='text-lg font-semibold'>Role:</p>
              <p className='text-lg'>{verificationData?.role}</p>
            </div>

            <div></div>
          </div>

          <p className='text-lg font-semibold'>Proof of role:</p>
          
          {publicFileUrl 
          ? publicFileUrl.endsWith(".pdf")
          ? <embed src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${publicFileUrl}`} width="full" height="375"></embed>
          : (publicFileUrl.endsWith(".png") || publicFileUrl.endsWith(".jpg")) && <img src={publicFileUrl} /> 
          : null}
        </div>
        
        <ReviewVerification id={id} admin={username} userApplied={userApplied} status={status} review={review} />
      </div>
      <br/>   
    </div>
  );
}