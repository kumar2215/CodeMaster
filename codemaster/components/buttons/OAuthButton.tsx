import Image, { StaticImageData } from "next/image";

export default function OAuthButton({provider, icon, action}: {provider: string, icon: StaticImageData, action: () => void}) {
  return (
    <button 
      className="btn btn-outline-light w-full"
      onClick={action}
      >
      <span className="mx-auto flex justify-center flex-row items-center gap-3">
        <Image src={icon.src} alt={provider} width={20} height={20} />
        {provider}
      </span>
    </button>
  );
}