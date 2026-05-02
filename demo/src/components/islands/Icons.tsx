type IconProps = { size?: number; strokeWidth?: number };

export function InspectorIcon({ size = 16, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="6" y="6" width="20" height="20" rx="2" opacity="0.35" />
      <path d="M22 22l5 5 3-2-5-5z" />
      <path d="M16 10v2M10 16h2" />
    </svg>
  );
}

export function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.67 5.58.67 11.86c0 5.02 3.24 9.28 7.74 10.79.57.1.78-.25.78-.55 0-.27-.01-.99-.02-1.95-3.15.69-3.81-1.52-3.81-1.52-.51-1.31-1.26-1.66-1.26-1.66-1.03-.71.08-.69.08-.69 1.14.08 1.74 1.18 1.74 1.18 1.01 1.74 2.66 1.24 3.31.95.1-.74.4-1.24.72-1.53-2.51-.29-5.16-1.27-5.16-5.64 0-1.25.44-2.27 1.17-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17.91-.26 1.89-.39 2.86-.39.97 0 1.95.13 2.86.39 2.18-1.48 3.14-1.17 3.14-1.17.63 1.58.23 2.75.12 3.04.73.8 1.17 1.82 1.17 3.07 0 4.38-2.66 5.35-5.19 5.63.41.36.77 1.06.77 2.14 0 1.54-.01 2.78-.01 3.16 0 .3.2.66.79.55 4.5-1.51 7.73-5.77 7.73-10.79C23.33 5.58 18.27.5 12 .5z" />
    </svg>
  );
}
