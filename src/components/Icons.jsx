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

export const SparkleIcon = () => (
  <svg {...base}>
    <path d="M11 3.5l1.9 5.6 5.6 1.9-5.6 1.9L11 18.5l-1.9-5.6L3.5 11l5.6-1.9z" />
    <path d="M19 15.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6z" />
  </svg>
);

export const EffectIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 3.5c-3 3-3 14 0 17M12 3.5c3 3 3 14 0 17M3.5 12c3-3 14-3 17 0M3.5 12c3 3 14 3 17 0" />
  </svg>
);

export const BurstIcon = () => (
  <svg {...base}>
    <path d="M13 3 6 13h5l-1 8 8-11h-5z" />
  </svg>
);

export const PaletteIcon = () => (
  <svg {...base}>
    <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 2-1 1.5-2.1-.6-1.3.2-2.4 1.6-2.4H17a3.5 3.5 0 0 0 3.5-3.5C20.5 6.9 16.7 3.5 12 3.5z" />
    <circle cx="7.8" cy="11.2" r="1" fill="currentColor" stroke="none" />
    <circle cx="10.8" cy="7.6" r="1" fill="currentColor" stroke="none" />
    <circle cx="15.4" cy="8.6" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const BackdropIcon = () => (
  <svg {...base}>
    <rect x="4" y="4" width="16" height="16" rx="5" />
    <path d="M20 12.5V15a5 5 0 0 1-5 5h-2.5z" fill="currentColor" opacity="0.35" stroke="none" />
  </svg>
);

export const FigureIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="8.5" r="3.4" />
    <path d="M5.5 20c.6-4 3.3-6 6.5-6s5.9 2 6.5 6" />
  </svg>
);

export const ShapeIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="9.5" r="5.5" />
    <path d="M8 20.5c.4-2.2 1.9-3.4 4-3.4s3.6 1.2 4 3.4" />
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

export const CloseIcon = () => (
  <svg {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ChevronIcon = () => (
  <svg {...base} width={16} height={16}>
    <path d="m9.5 6 6 6-6 6" />
  </svg>
);

export const MoonIcon = () => (
  <svg {...base}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const SunIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="5" />
    <path d="M12 3v1m0 16v1m9-9h1M4 12h1m4.93-4.93l.71.71m11.78-11.78-.71.71M12 12.79l.71.71M12 12.79l-.71-.71M12 12.79l.71-.71M12 12.79l-.71.71" />
  </svg>
);

export const HeartIcon = () => (
  <svg {...base} width={13} height={13} fill="currentColor" stroke="none">
    <path d="M12 21s-8-4.9-8-11.2A4.6 4.6 0 0 1 12 7.1a4.6 4.6 0 0 1 8 2.7C20 16.1 12 21 12 21z" />
  </svg>
);
