"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Preferences({ preferences, username }: {preferences: any, username: string}) {

  const supabase = createClient();
  const router = useRouter();
  const { body, header } = preferences;

  const [bodyBackgroundColor, setBodyBackgroundColor] = useState(body.backgroundColor);
  const [bodyTextColor, setBodyTextColor] = useState(body.color);
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState(header.backgroundColor);
  const [headerTextColor, setHeaderTextColor] = useState(header.color);

  function colorInputHandler(name: string, value: string, setter: any) {
    return (
      <div className="flex flex-row gap-2 mt-1">
        <label className="font-semibold">{`${name}:`}</label>
        <input
          type="color"
          value={value}
          onChange={(e) => {
            setter(e.target.value);
          }}
        />
      </div>
    );
  }

  const savePreferences = async () => {
    const { data, error } = await supabase
      .from('Users')
      .update({
        preferences: {
          body: {
            backgroundColor: bodyBackgroundColor,
            color: bodyTextColor
          },
          header: {
            backgroundColor: headerBackgroundColor,
            color: headerTextColor
          }
        }
      })
      .eq('username', username);

    if (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    } else {
      toast.success("Preferences successfully updated!", {autoClose: 3000});
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full mb-2" style={{borderBottom: "1px solid black"}}>
        <h1 className="mb-2 text-xl font-bold">Preferences</h1>
      </div>

      <div className="flex flex-col gap-4 mt-4"> 
        <div className="flex flex-row justify-between">
          <h1 className="text-lg font-semibold">Body:</h1>
          {colorInputHandler("Background Color", bodyBackgroundColor, setBodyBackgroundColor)}
          {colorInputHandler("Text Color", bodyTextColor, setBodyTextColor)}
          <h1></h1>
        </div>

        <div className="flex flex-row justify-between">
          <h1 className="text-lg font-semibold">Navbar:</h1>
          {colorInputHandler("Background Color", headerBackgroundColor, setHeaderBackgroundColor)}
          {colorInputHandler("Text Color", headerTextColor, setHeaderTextColor)}
          <h1></h1>
        </div>

        <div className="flex flex-row justify-start">
          <button
          className="flex items-center justify-center w-1/12 h-10 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-700"
          onClick={savePreferences}
          >
            Save
          </button>
        </div>
      </div>
      
    </div>
  );

}