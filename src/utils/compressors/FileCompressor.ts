import imageCompression, { Options } from "browser-image-compression";
function base64ToBlob(base64String: string) {
  const base64Data = base64String.split(",")[1];
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const contentType =
    base64String.split(",")[0].match(/:(.*?);/)?.[1] || "image/jpeg";

  return new Blob([byteArray], { type: contentType });
}

export async function compressFileBase64(base64File: string): Promise<Blob> {
  const fileBlob = base64ToBlob(base64File);

  const contentType =
    base64File.split(",")[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const file = new File([fileBlob], "image.jpg", { type: contentType });

  const options: Options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 600,
    initialQuality: 0.6,
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(file, options);
  return compressedFile;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// const compressedBase64 = await blobToBase64(compressedFile);
// return compressedBase64;
