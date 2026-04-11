/**
 * NavigationProgressBar.tsx
 * Barre de progression fine sous le header qui s'anime à chaque changement de route.
 * Style NProgress — fine ligne de 2-3px, couleur accent, animation fluide.
 */

import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

export function NavigationProgressBar() {
  const [location] = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevLocationRef = useRef(location);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startProgress = () => {
    clearTimers();
    setProgress(0);
    setVisible(true);

    // Avancer rapidement jusqu'à ~80%, puis ralentir
    let currentProgress = 0;
    intervalRef.current = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      if (currentProgress >= 85) {
        currentProgress = 85;
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      setProgress(currentProgress);
    }, 100);
  };

  const completeProgress = () => {
    clearTimers();
    setProgress(100);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);
  };

  useEffect(() => {
    if (location !== prevLocationRef.current) {
      prevLocationRef.current = location;
      startProgress();
      // Compléter après un court délai (simule la fin du chargement)
      timerRef.current = setTimeout(() => {
        completeProgress();
      }, 350);
    }
    return () => clearTimers();
  }, [location]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
      <div
        style={{
          height: "2px",
          width: `${progress}%`,
          transition: progress === 100 ? "width 0.15s ease-out, opacity 0.3s ease 0.1s" : "width 0.2s ease-out",
          opacity: visible ? 1 : 0,
          background: "linear-gradient(90deg, oklch(0.55 0.18 270), oklch(0.65 0.22 290), oklch(0.7 0.2 310))",
          boxShadow: "0 0 8px oklch(0.65 0.22 290 / 0.6)",
        }}
      />
    </div>
  );
}

export default NavigationProgressBar;
