import Image from "next/image";
import errorImage from "@/assets/404-dino_meme.jpg";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center my-auto">
      <div className="flex flex-col gap-12 p-4 bg-red-400 rounded-lg">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-12">
          <div className="flex flex-col justify-center">
            <h1 className="font-bold text-white text-9xl">404</h1>
            <h2 className="text-4xl font-bold text-white">Page not found</h2>
          </div>
          <Image src={errorImage} alt="error image" height={400} width={400} className="rounded-lg" />
        </div>
        <p className="text-lg text-white">The page you are looking for might have been removed, is temporarily unavailable or doesn't exist.</p>
      </div>
    </div>
  );
}  