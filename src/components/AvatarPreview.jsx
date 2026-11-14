import { useEffect, useRef } from "react";
import Bezel from "./Bezel";
import { drawAvatar } from "../lib/avatar";

const PREVIEW_SIZE = 720;

export default function AvatarPreview({ bg, figure, shape, decors }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawAvatar(canvasRef.current, PREVIEW_SIZE, { bg, figure, shape, decors });
    }
  }, [bg, figure, shape, decors]);

  return (
    <Bezel>
      <canvas
        ref={canvasRef}
        width={PREVIEW_SIZE}
        height={PREVIEW_SIZE}
        className="absolute inset-0 size-full"
        role="img"
        aria-label="Avatar preview"
      />
    </Bezel>
  );
}
