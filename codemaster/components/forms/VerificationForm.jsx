"use client";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import { toast } from "react-toastify";

export default function VerificationForm({ username }) {

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      username: username,
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      otherRole: "",
      organizationName: "",
      proofOfRole: null
    }
  });

  let role = watch('role');
  let savedFile = watch('proofOfRole');

  const supabase = createClient();

  const [file, setFile] = useState(null);
  const [publicFileUrl, setPublicFileUrl] = useState("");
  const [uploadedBefore, setUploadedBefore] = useState(false);

  useEffect(() => {
    async function uploadFile() {
      if (savedFile) {
        const actualFile = savedFile[0];

        if (actualFile && actualFile.size > 2_097_152) {
          toast.error("File cannot be larger than 2 MB.", {autoClose: 3000});
          return;
        }
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(`${username}/proofOfRole-${actualFile.name}`, actualFile);
        if (error) { 
          console.error(error); 
          toast.error("Error uploading file. Please try again.", {autoClose: 3000});
          return;
        }

        const publicURL = supabase.storage
          .from('documents')
          .getPublicUrl(`${username}/proofOfRole-${actualFile.name}`).data.publicUrl;
        if (!publicURL) {
          toast.error("Error uploading file. Please try again.", {autoClose: 3000});
          return;
        }

        if (uploadedBefore) {
          const { data, error } = await supabase.storage
            .from('documents')
            .remove([`${username}/proofOfRole-${file.name}`]);
        }

        setFile(actualFile);
        setPublicFileUrl(publicURL);
        setUploadedBefore(true);
      }
    }
    uploadFile();
  }, [savedFile]);


  const submitVerification = async (formData) => {
    
    const firstName = formData.firstName;
    const lastName = formData.lastName;
    const email = formData.email;
    const role = formData.role;
    const otherRole = formData.otherRole;
    const organizationName = formData.organizationName;
    
    // data validation
    if (!firstName || !lastName || !email || !role || !organizationName) {
      toast.error("Please fill in all required fields.", {autoClose: 3000});
      return;
    }
    if (role === "Other" && !otherRole) {
      toast.error("Please fill in all required fields.", {autoClose: 3000});
      return;
    }
    if (!file) {
      toast.error("Please upload a file.", {autoClose: 3000});
      return;
    }
    if (file && file.size > 2_097_152) {
      toast.error("File cannot be larger than 2MB.", {autoClose: 3000});
      return;
    }
    if (!publicFileUrl || !uploadedBefore) {
      toast.error("Something went wrong while uploading the file. Please try again.", {autoClose: 3000});
      return;
    }

    const verificationData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: role === "Other" ? otherRole : role,
      organizationName: organizationName,
      proofOfRole: {
        filename: file.name,
        bucket: "documents",
        location: `${username}/proofOfRole-${file.name}`,
        publicUrl: publicFileUrl
      }
    };

    const { data, error } = await supabase.from("Verifications")
      .insert({ user: username, verification_data: verificationData, status : "pending" })
      .select();

    if (error) {
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    }

    const admins = process.env.NEXT_PUBLIC_ADMINS?.split(",");
    
    const notification = {
      from: username,
      message: `${username} has applied to become a verified user. Waiting for approval.`,
      type: "Approve",
      link: `/verify/${data && data[0].id}`
    }

    for (const admin of admins) {
      const res = await supabase.from("Users")
        .select("notifications")
        .eq("username", admin);

      if (res.error) { 
        toast.error("Something went wrong. Please try again.", {autoClose: 3000});
        return;
      }

      const notifications = res.data && res.data[0].notifications;
      notifications.push(notification);
      const res2 = await supabase.from("Users")
        .update({ notifications })
        .eq("username", admin);
      if (res2.error) { 
        toast.error("Something went wrong. Please try again.", {autoClose: 3000});
        return;
      }
    }

    toast.success("Verification form has been submitted successfully!", {autoClose: 3000});
  }

  return (
    <form className="w-full max-w-5xl">
      <div className='flex flex-col w-full gap-10 p-5 ml-6 bg-gray-200 rounded-lg'>

        <div className='flex flex-row justify-between'>
          <div className="flex flex-row gap-2">
            <p className='text-lg'>Firstname:</p>
            <label className="leading-5 h-[28px]" style={{borderWidth: "1.5px"}}>
              <input className='h-6 pl-2 input-info' {...register('firstName')} />
            </label>
          </div>
          
          <div className="flex flex-row gap-2">
            <p className='text-lg'>Lastname:</p>
            <label className="leading-5 h-[28px]" style={{borderWidth: "1.5px"}}>
              <input className='h-6 pl-2 input-info' {...register('lastName')} />
            </label>
          </div>

          <div></div>
        </div>

        <div className="flex flex-row gap-2">
          <p className='text-lg'>Email:</p>
          <label className="leading-5 h-[28px]" style={{borderWidth: "1.5px"}}>
            <input className='h-6 pl-2 input-info' type="email" {...register('email')} />
          </label>
        </div>

        <div className='flex flex-row justify-between'>
          <div className="flex flex-row gap-2">
            <p className='text-lg'>Role:</p>
            <label className="leading-5 h-[28px]" style={{borderWidth: "1.5px"}}>
              <select className='h-6 input-info' {...register('role')}>
                <option value="TA">Student TA</option>
                <option value="Teacher">Teacher</option>
                <option value="SchoolAdmin">School Admin</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>

          {role === "Other" && 
          <div className="flex flex-row gap-2">
            <p className='text-lg'>Specify:</p>
            <label className="leading-5 h-[28px]" style={{borderWidth: "1.5px"}}>
              <input className='h-6 pl-2 input-info' {...register('otherRole')} />
            </label>
          </div>}

          <div></div>
        </div>

        <div className="flex flex-row gap-2">
          <p className='text-lg'>Organization:</p>
          <label className="leading-5 h-[28px]" style={{borderWidth: "1.5px"}}>
            <input className='h-6 pl-2 input-info' {...register('organizationName')} />
          </label>
        </div>

        <div className="flex flex-row gap-2">
          <p className='text-lg'>Proof of role (file size must not exceed 2MB):</p>
          <label className="mt-1 leading-4">
            <input className='h-6 input-info' type="file" accept="image/*, application/pdf" {...register('proofOfRole')} />
          </label>
        </div>

        {publicFileUrl 
        ? publicFileUrl.endsWith(".pdf")
        ? <embed src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${publicFileUrl}`} width="full" height="375"></embed>
        : (publicFileUrl.endsWith(".png") || publicFileUrl.endsWith(".jpg")) && <img src={publicFileUrl} /> 
        : null}

      </div>
      
      <div className='flex flex-row w-full gap-3 p-5 ml-2'>
        <SubmitButton
          formAction={handleSubmit(submitVerification)}
          className='btn btn-success'
          pendingText='Submitting...'
        >
        Submit Form
        </SubmitButton>
      </div>
    </form>
  );

}