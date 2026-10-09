const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const TypeIcon = () => (
  <svg {...base}>
    <path d="M5 7V5h14v2M12 5v14M9 19h6" />
  </svg>
);

export const FontIcon = () => (
  <svg {...base}>
    <path d="M2.5 18 8 5l5.5 13M4.6 13.5h6.8" />
    <circle cx="18" cy="15.3" r="2.7" />
    <path d="M20.7 12.6V18" />
  </svg>
);

export const GradientIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" opacity="0.35" />
  </svg>
);

export const DownloadIcon = () => (
  <svg {...base}>
    <path d="M12 4v11m-4.5-4.5L12 15l4.5-4.5M5 20h14" />
  </svg>
);

export const CheckIcon = () => (
  <svg {...base}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export const HeartIcon = () => (
  <svg {...base} width={13} height={13} fill="currentColor" stroke="none">
    <path d="M12 21s-8-4.9-8-11.2A4.6 4.6 0 0 1 12 7.1a4.6 4.6 0 0 1 8 2.7C20 16.1 12 21 12 21z" />
  </svg>
);
