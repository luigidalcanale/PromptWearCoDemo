type LogoProps = {
  size?: number;
  className?: string;
};

/**
 * PromptWear Co. mark — a stylized "P" formed as a speech bubble
 * (the "prompt") merged with a "W" beneath. Inline SVG so it inherits
 * currentColor and works in both light and dark themes.
 */
export function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="PromptWear Co."
    >
      {/* Speech-bubble P */}
      <path
        d="M14 8 H38 a14 14 0 0 1 0 28 H22 L14 44 Z"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Dots inside bubble */}
      <circle cx="22" cy="22" r="1.8" fill="currentColor" />
      <circle cx="28" cy="22" r="1.8" fill="currentColor" />
      <circle cx="34" cy="22" r="1.8" fill="currentColor" />
      {/* W stroke */}
      <path
        d="M28 38 L36 58 L42 46 L48 58 L56 38"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
