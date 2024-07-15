'use client';
import { toast } from "react-toastify";

export default function PremiumButton() {

  return (
    <button
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      onClick={() => toast.info("Just a placeholder for now!", { autoClose: 3000 }) }
    >
      Get Premium
    </button>
  );
}
