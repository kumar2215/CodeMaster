// 'use client';
// import Link from "next/link";

// export default function PremiumButton() {
//   return (
//     <Link
//     className="flex px-3 py-2 no-underline rounded-md bg-btn-background hover:bg-btn-background-hover"
//     href="/pricing"
//     >
//       <button>Get Premium</button>
//     </Link>
//   );
// }

'use client';
import { toast } from "react-toastify";

export default function PremiumButton() {
  return (
    <button
      className="flex px-3 py-2 no-underline rounded-md bg-btn-background hover:bg-btn-background-hover"
      onClick={() => toast("Just a placeholder for now!", {type: "info", autoClose: 3000}) }
    >
      Get Premium
    </button>
  );
}
