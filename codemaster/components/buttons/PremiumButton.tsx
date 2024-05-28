'use client';

export default function PremiumButton() {
  return (
    <button
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      onClick={() => alert("Just a placeholder for now!")}
    >
      Get Premium
    </button>
  );
}
