// @ts-nocheck
import { useRef, useState, useEffect, RefObject } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // Minimum distance to trigger swipe (px)
  velocityThreshold?: number; // Minimum velocity to trigger swipe (px/ms)
}

interface SwipeState {
  isSwiping: boolean;
  direction: 'left' | 'right' | null;
  distance: number;
}

export function useSwipeGesture<T extends HTMLElement>(
  options: SwipeGestureOptions = {}
): [RefObject<T>, SwipeState] {
  const {
    onSwipeLeft,
    onSwipeRight,
    threshold = 80,
    velocityThreshold = 0.3,
  } = options;

  const elementRef = useRef<T>(null);
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    direction: null,
    distance: 0,
  });

  const touchStartX = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const currentX = useRef<number>(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartTime.current = Date.now();
      currentX.current = touchStartX.current;
      
      setSwipeState({
        isSwiping: true,
        direction: null,
        distance: 0,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!swipeState.isSwiping) return;

      currentX.current = e.touches[0].clientX;
      const distance = currentX.current - touchStartX.current;
      const direction = distance > 0 ? 'right' : 'left';

      setSwipeState({
        isSwiping: true,
        direction,
        distance: Math.abs(distance),
      });

      // Apply transform to element
      if (element) {
        element.style.transform = `translateX(${distance}px)`;
      }
    };

    const handleTouchEnd = () => {
      const distance = currentX.current - touchStartX.current;
      const duration = Date.now() - touchStartTime.current;
      const velocity = Math.abs(distance) / duration;

      const shouldTrigger = 
        Math.abs(distance) >= threshold || 
        velocity >= velocityThreshold;

      if (shouldTrigger) {
        if (distance < 0 && onSwipeLeft) {
          onSwipeLeft();
        } else if (distance > 0 && onSwipeRight) {
          onSwipeRight();
        }
      }

      // Reset transform
      if (element) {
        element.style.transform = '';
      }

      setSwipeState({
        isSwiping: false,
        direction: null,
        distance: 0,
      });
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [swipeState.isSwiping, onSwipeLeft, onSwipeRight, threshold, velocityThreshold]);

  return [elementRef, swipeState];
}
