import type { ReadingShareCardSize } from "./readingFlow";

export async function renderSvgMarkupToPngBlob(
  svgMarkup: string,
  size: ReadingShareCardSize,
) {
  const svgBlob = new Blob([svgMarkup], {
    type: "image/svg+xml;charset=utf-8",
  });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadSvgImage(svgUrl);
    const scale =
      typeof window !== "undefined"
        ? Math.max(1, Math.min(window.devicePixelRatio || 1, 2))
        : 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(size.width * scale);
    canvas.height = Math.round(size.height * scale);

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas context is not available.");
    }

    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.drawImage(image, 0, 0, size.width, size.height);

    const pngBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png", 1);
    });

    if (!pngBlob) {
      throw new Error("PNG blob could not be created.");
    }

    return pngBlob;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function loadSvgImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("SVG image could not be loaded."));
    image.src = url;
  });
}