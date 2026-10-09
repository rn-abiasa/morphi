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

export const SparkleIcon = () => (
  <svg {...base}>
    <path d="M11 3.5l1.9 5.6 5.6 1.9-5.6 1.9L11 18.5l-1.9-5.6L3.5 11l5.6-1.9z" />
    <path d="M19 15.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6z" />
  </svg>
);

export const SkinIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9 10.5v2.5M15 10.5v2.5" />
  </svg>
);

export const EyeIcon = () => (
  <svg {...base}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);

export const HairIcon = () => (
  <svg {...base}>
    <path d="M4 15a8 8 0 0 1 16 0l-3-3.2-2.5 3.2L12 11.5 9.5 15 7 11.8z" />
  </svg>
);

export const DropIcon = () => (
  <svg {...base}>
    <path d="M12 3.5s6 6.2 6 10.3a6 6 0 0 1-12 0c0-4.1 6-10.3 6-10.3z" />
  </svg>
);

export const DetailsIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.6 13.6Q12 17 15.4 13.6M9 10h.01M15 10h.01" />
  </svg>
);

export const GlassesIcon = () => (
  <svg {...base}>
    <circle cx="7" cy="14" r="3.6" />
    <circle cx="17" cy="14" r="3.6" />
    <path d="M10.6 13.5h2.8M3.4 14 5 7.5M20.6 14 19 7.5" />
  </svg>
);

export const TuneIcon = () => (
  <svg {...base}>
    <path d="M4 7h9M19 7h1M4 17h1M11 17h9" />
    <circle cx="16" cy="7" r="2.2" />
    <circle cx="8" cy="17" r="2.2" />
  </svg>
);

export const DiceIcon = () => (
  <svg {...base}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <path d="M9 9h.01M15 9h.01M12 12h.01M9 15h.01M15 15h.01" strokeWidth="2.4" />
  </svg>
);

export const CloseIcon = () => (
  <svg {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const HeartIcon = () => (
  <svg {...base} width={13} height={13} fill="currentColor" stroke="none">
    <path d="M12 21s-8-4.9-8-11.2A4.6 4.6 0 0 1 12 7.1a4.6 4.6 0 0 1 8 2.7C20 16.1 12 21 12 21z" />
  </svg>
);
