import Link from "next/link";

export default async function SignUpButton() {

  return (
    <Link
      href="/signup"
      className="bg-green-500 py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Sign Up
    </Link>
  );
}
