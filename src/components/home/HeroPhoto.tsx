import Image from "next/image";
import heroDog from "../../../public/images/hero-dog.jpg";

/**
 * The hero photo: no frame, no shadow, no border-radius — the dog is meant
 * to read as if it were placed directly on the page, cutting through the
 * giant background wordmark the way the reference design does.
 *
 * `mix-blend-mode: multiply` collapses the photo's near-white background
 * into the cream page color so only the dog itself reads as opaque. The
 * grayscale + contrast pair keeps the editorial monochrome look.
 */
export function HeroPhoto({ alt, className }: { alt: string; className?: string }) {
  return (
    <div className={className}>
      <Image
        src={heroDog}
        alt={alt}
        fill
        priority
        sizes="(min-width: 1024px) 40vw, (min-width: 640px) 70vw, 90vw"
        className="object-cover object-top mix-blend-multiply grayscale contrast-[1.15] brightness-110"
      />
    </div>
  );
}
