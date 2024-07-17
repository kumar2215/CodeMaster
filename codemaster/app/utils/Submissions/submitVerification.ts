"use client";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export default async function submitVerification(formData: any, otherData: any) {
    
  const firstName = formData.firstName;
  const lastName = formData.lastName;
  const email = formData.email;
  const role = formData.role;
  const otherRole = formData.otherRole;
  const organizationName = formData.organizationName;
  
  const file = otherData.file;
  const publicFileUrl = otherData.publicFileUrl;
  const uploadedBefore = otherData.uploadedBefore;
  const username = otherData.username;
  
  const supabase = createClient();

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

  const admins: any = process.env.NEXT_PUBLIC_ADMINS?.split(",");
  
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