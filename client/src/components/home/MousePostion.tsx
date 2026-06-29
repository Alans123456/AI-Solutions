// src/components/hero/hooks/useMousePosition.ts
import { useState, useEffect, useCallback } from "react";

interface MousePosition {
  x: number; // Percentage of viewport width (0-100)
  y: number; // Percentage of viewport height (0-100)
  pxX: number; // Pixel position X
  pxY: number; // Pixel position Y
  velocity: number; // Movement speed in pixels/frame
  isMoving: boolean; // If mouse recently moved
}

interface MousePositionOptions {
  throttleMs?: number; // Throttle updates (default 16ms ~60fps)
  normalize?: boolean; // Return % values (default true)
  trackVelocity?: boolean; // Calculate movement speed (default false)
}

export const useMousePosition = (options?: MousePositionOptions) => {
  const [position, setPosition] = useState<MousePosition>({
    x: 10,
    y: 10,
    pxX: 0,
    pxY: 0,
    velocity: 0,
    isMoving: false,
  });

  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0, time: 0 });
  const [moveTimeout, setMoveTimeout] = useState<NodeJS.Timeout>();

  const updatePosition = useCallback(
    (e: MouseEvent) => {
      const now = performance.now();
      const { clientX, clientY } = e;

      // Calculate velocity if enabled
      let velocity = 0;
      if (options?.trackVelocity && lastPosition.time > 0) {
        const dx = clientX - lastPosition.x;
        const dy = clientY - lastPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const timeDelta = now - lastPosition.time;
        velocity = timeDelta > 0 ? distance / (timeDelta / 1000) : 0; // pixels/second
      }

      setPosition({
        x: (clientX / window.innerWidth) * 100,
        y: (clientY / window.innerHeight) * 100,
        pxX: clientX,
        pxY: clientY,
        velocity,
        isMoving: true,
      });

      setLastPosition({ x: clientX, y: clientY, time: now });

      // Reset isMoving after brief inactivity
      if (moveTimeout) clearTimeout(moveTimeout);
      setMoveTimeout(
        setTimeout(() => {
          setPosition((prev) => ({ ...prev, isMoving: false }));
        }, 100)
      );
    },
    [lastPosition, options?.trackVelocity, moveTimeout]
  );

  useEffect(() => {
    const throttleDelay = options?.throttleMs ?? 16;
    let throttledUpdate: (e: MouseEvent) => void;
    let lastCall = 0;

    if (throttleDelay > 0) {
      throttledUpdate = (e: MouseEvent) => {
        const now = performance.now();
        if (now - lastCall >= throttleDelay) {
          lastCall = now;
          updatePosition(e);
        }
      };
    } else {
      throttledUpdate = updatePosition;
    }

    window.addEventListener("mousemove", throttledUpdate);
    return () => {
      window.removeEventListener("mousemove", throttledUpdate);
      if (moveTimeout) clearTimeout(moveTimeout);
    };
  }, [updatePosition, options?.throttleMs, moveTimeout]);

  // Return normalized or pixel values based on options
  return options?.normalize === false
    ? { ...position, x: position.pxX, y: position.pxY }
    : position;
};
