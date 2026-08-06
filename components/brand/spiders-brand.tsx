import type { SVGProps } from "react";

export function SpiderWebMark({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M32 4v56M4 32h56M12.2 12.2l39.6 39.6M51.8 12.2 12.2 51.8"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M32 13 45.4 18.6 51 32 45.4 45.4 32 51 18.6 45.4 13 32l5.6-13.4L32 13Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M32 21 39.8 24.2 43 32l-3.2 7.8L32 43l-7.8-3.2L21 32l3.2-7.8L32 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m32 25 2.1 4.9L39 32l-4.9 2.1L32 39l-2.1-4.9L25 32l4.9-2.1L32 25Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function WebPattern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 420"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="210" cy="210" r="196" stroke="currentColor" />
      <circle cx="210" cy="210" r="146" stroke="currentColor" />
      <circle cx="210" cy="210" r="96" stroke="currentColor" />
      <circle cx="210" cy="210" r="46" stroke="currentColor" />
      <path
        d="M210 14v392M14 210h392M71.4 71.4l277.2 277.2M348.6 71.4 71.4 348.6M135 28.8l150 362.4M28.8 135l362.4 150M285 28.8 135 391.2M391.2 135 28.8 285"
        stroke="currentColor"
      />
    </svg>
  );
}

export function BrandLockup({
  tagline,
  inverse = false,
  compact = false,
}: {
  tagline?: string;
  inverse?: boolean;
  compact?: boolean;
}) {
  return (
    <span className="flex items-center gap-3">
      <span
        className={`grid shrink-0 place-items-center rounded-2xl ${compact ? "h-10 w-10" : "h-12 w-12"} ${inverse ? "bg-white/12 text-emerald-200 ring-1 ring-white/20" : "bg-gradient-to-br from-emerald-200 via-cyan-300 to-blue-500 text-indigo-900 shadow-lg shadow-cyan-200/60"}`}
      >
        <SpiderWebMark className={compact ? "h-7 w-7" : "h-9 w-9"} />
      </span>
      <span>
        <strong
          className={`block text-base font-extrabold tracking-tight ${inverse ? "text-white" : "text-indigo-950"}`}
        >
          Spiders AI
        </strong>
        {tagline ? (
          <small
            className={`block text-[10px] ${inverse ? "text-cyan-100/80" : "text-slate-500"}`}
          >
            {tagline}
          </small>
        ) : null}
      </span>
    </span>
  );
}
