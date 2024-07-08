"use client";
import Link from "next/link";

export default function Notification(params: any) {

  const data = params.data;

  const message = data.message;
  const from = data.from;
  const action = data.action;

  return (
    <div className="w-full h-16 py-5 bg-green-200 shadow-md rounded-lg flex items-center justify-between px-4">
      <div className="flex flex-row gap-3">
        <div className="text-lg text-gray-500 font-semibold">{`From ${from}:`}</div>
        <div className="text-lg font-semibold">{message}</div>
      </div>
      <button className="flex items-center">
        <Link href={action.link} className="ml-4 text-base text-blue-500">{action.type}</Link>
      </button>
    </div>
  );
}
