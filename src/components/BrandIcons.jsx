// Brand icons drawn in the same stroke style as lucide-react (lucide v1 no longer ships brand icons).
const base = (size) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

export const DiscordIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <path d="M8.5 17c0 1 -1.356 3 -1.832 3c-1.429 0 -2.698 -1.667 -3.333 -3c-.635 -1.667 -.476 -5.833 1.428 -11.5c1.388 -1.015 2.782 -1.34 4.237 -1.5l.975 1.923a11.913 11.913 0 0 1 4.053 0l.972 -1.923c1.5 .16 2.915 .5 4.285 1.5c1.905 5.667 2.063 9.833 1.429 11.5c-.635 1.333 -1.904 3 -3.333 3c-.476 0 -1.832 -2 -1.832 -3" />
    <path d="M7.5 16c3.5 1.333 5.5 1.333 9 0" />
  </svg>
);

export const XIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

export const InstagramIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5h.01" />
  </svg>
);

export const TikTokIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z" />
  </svg>
);
