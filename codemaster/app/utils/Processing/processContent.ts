import { toast } from "react-toastify";

/*
Function to generate random strings.
This is to create unique filenames for the image files.
This way the browser is forced to rerender the image, instead of relying on the cache.
source: https://stackoverflow.com/a/1349426
*/
function makeid(length: number = 8) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function b64toBlob(content: string, type: string): Blob {
  const byteCharacters = atob(content);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type });
}

export default async function processContent(rawImages: HTMLCollectionOf<HTMLImageElement>) {

  const images: File[] = await Promise.all(
    Array.from(rawImages).map(async (image: HTMLImageElement, index: number) => {
      const src = image.src;
      if (src.startsWith("data:image")) {
        const content = image.src.split(",")[1];
        const blob = b64toBlob(content, "image/png");
        const file = new File([blob], `${makeid()}.png`, { type: "image/png" });
        return file;
      } else {
        const res = await fetch(src);
        return new File([new Blob([new Uint8Array(await res.arrayBuffer())])], `${makeid()}.png`, { type: "image/png" });
    }})
  );

  for (const image of images) {
    if (image.size > 2_097_152) {
      toast.error("File cannot be larger than 2MB.", {autoClose: 3000});
      return [false, null];
    }
  }

  return [true, images];
}