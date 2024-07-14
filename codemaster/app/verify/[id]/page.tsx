import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/misc/navbar";
import ReviewVerification from "@/components/misc/reviewVerification";

const thisLink = "/others";

export default async function Verify({params: {id}}: {params: {id: string}}) {

  const supabase = createClient();

  const { 
    data: { user } 
  } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/login");
  }

  const username = user.user_metadata.username;

  const { data, error } = await supabase.from("Verifications").select("*").eq("id", id);
  if (error) { console.error(error) }

  if (data?.length === 0) {
    return (
      <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
        <Navbar thisLink={thisLink}/>
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
    <div className="flex-1 w-full flex flex-col gap-10 items-center" style={{backgroundColor: "#80bfff"}}>
      <Navbar thisLink={thisLink}/>
      <h2 className="text-4xl pt-2">Application details</h2>

      <div className="w-full max-w-5xl flex flex-col gap-4">
        <div className='flex flex-col bg-gray-200 rounded-lg p-5 gap-5'>

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