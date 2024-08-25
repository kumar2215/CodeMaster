"use client";
import downloadResults from "@/app/utils/Misc/downloadResults";
import downloadIcon from "@/assets/download-icon.jpg";

export default function DownloadButton({data} : {data: any}) {
  return (
    <button 
    onClick={() => downloadResults(data)}
    className="flex flex-row justify-center gap-4 p-2 text-base font-medium text-center bg-blue-300 cursor-pointer rounded-2xl hover:bg-blue-400 hover:font-semibold" 
    style={{border: "1px solid black"}}>
      <img src={downloadIcon.src} alt="download-icon" className="w-6 h-6" />
      <p>Download results</p>
    </button>
  );
}