import { ImagePlus } from "lucide-react";

// A drop-in spot for a photo. While there's no image yet it shows a friendly
// dashed placeholder; once you add one it shows the real photo.
//
// HOW TO ADD A PHOTO:
//   1. Put the image in src/assets/images/ and register it in
//      src/assets/images/index.ts (see that file).
//   2. Import it on the page and pass it in:  <ImagePlaceholder src={myPhoto} />
//
// Props:
//   • src     – an imported image (optional; omit to show the placeholder)
//   • alt     – description of the photo (for accessibility)
//   • label   – hint text shown on the empty placeholder
//   • ratio   – Tailwind aspect class, e.g. "aspect-video" (default) or "aspect-square"
//   • caption – optional caption shown under the image

export function ImagePlaceholder({
  src,
  alt = "",
  label = "Add a photo",
  ratio = "aspect-video",
  caption,
}: {
  src?: string;
  alt?: string;
  label?: string;
  ratio?: string;
  caption?: string;
}) {
  return (
    <figure className="w-full">
      <div className={`${ratio} w-full overflow-hidden border border-border bg-muted`}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border text-muted-foreground/50">
            <ImagePlus size={22} />
            <span className="text-[11px] uppercase tracking-wider">{label}</span>
          </div>
        )}
      </div>
      {caption && <figcaption className="text-xs text-muted-foreground mt-2 text-center">{caption}</figcaption>}
    </figure>
  );
}
