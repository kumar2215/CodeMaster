"use client";
import { useState } from "react";
import downloadResults from "@/app/utils/Misc/downloadResults";
import downloadIcon from "@/assets/download-icon.jpg";

export default function DownloadButton({data} : {data: any}) {

  const [isLoading, setLoading] = useState(false);

  return (
    <button
    title="download results" 
    onClick={() => downloadResults(data, setLoading)}
    className="flex flex-row justify-center p-2 text-base font-medium text-center bg-blue-300 cursor-pointer rounded-2xl hover:bg-blue-400 hover:font-semibold" 
    style={{border: "1px solid black"}}>
      {isLoading 
      ? <div className="flex flex-row gap-4">
          <span className="w-6 loading loading-spinner"></span>
          <p>Downloading...</p>
        </div>
      : <div className="flex flex-row gap-4">
          <img src={downloadIcon.src} alt="download-icon" className="w-6 h-6" />
          <p>Download results</p>
        </div>
      }
    </button>
  );
}