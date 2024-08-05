'use client';
import Link from "next/link";

export default function PremiumButton() {
  return (
    <Link
    className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    href="/pricing"
    >
      <button>Get Premium</button>
    </Link>
  );
}
