import { useState } from "react";

export function VenueImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <>
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background:
              "linear-gradient(110deg, var(--muted) 30%, color-mix(in oklab, var(--muted) 60%, white) 50%, var(--muted) 70%)",
            backgroundSize: "200% 100%",
          }}
          aria-hidden
        />
      )}
      {!errored && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setErrored(true);
            setLoaded(true);
          }}
          className={className}
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 300ms ease" }}
        />
      )}
    </>
  );
}