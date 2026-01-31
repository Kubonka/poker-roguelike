"use client";

import { useEffect, useRef } from "react";
import { startPhaser } from "@/game/startPhaser";
export default function GameCanvas() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    let game: unknown;

    startPhaser(ref.current).then((g) => {
      game = g;
    });

    return () => {};
  }, []);

  return <div id="phaser-root" ref={ref} />;
}
