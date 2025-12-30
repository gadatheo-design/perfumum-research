import { useRef, useState, useEffect, RefObject } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number; // Distance to trigger refresh (px)
  maxPullDistance?: number; // Maximum pull distance (px)
  disabled?: boolean;
}

interface PullState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  shouldRefresh: boolean;
}

export function usePullToRefresh<T extends HTMLElement>(
  options: PullToRefreshOptions
): [RefObject<T>, PullState] {
  const {
    onRefresh,
    threshold = 80,
    maxPullDistance = 120,
    disabled = false,
  } = options;

  const containerRef = useRef<T>(null);
  const [pullState, setPullState] = useState<PullState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    shouldRefresh: false,
  });

  const touchStartY = useRef<number>(0);
  const scrollTop = useRef<number>(0);

  useEffect(() => {
    if (disabled) return;
    
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if scrolled to top
      scrollTop.current = container.scrollTop;
      if (scrollTop.current > 0) return;

      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (scrollTop.current > 0) return;
      if (pullState.isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - touchStartY.current;

      // Only pull down
      if (distance <= 0) return;

      // Prevent default scroll behavior when pulling
      if (distance > 10) {
        e.preventDefault();
      }

      const pullDistance = Math.min(distance * 0.5, maxPullDistance);
      const shouldRefresh = pullDistance >= threshold;

      setPullState({
        isPulling: true,
        isRefreshing: false,
        pullDistance,
        shouldRefresh,
      });
    };

    const handleTouchEnd = async () => {
      if (!pullState.isPulling) return;

      if (pullState.shouldRefresh) {
        setPullState({
          isPulling: false,
          isRefreshing: true,
          pullDistance: threshold,
          shouldRefresh: false,
        });

        try {
          await onRefresh();
        } catch (error) {
          console.error('[Pull to Refresh] Error:', error);
        } finally {
          setPullState({
            isPulling: false,
            isRefreshing: false,
            pullDistance: 0,
            shouldRefresh: false,
          });
        }
      } else {
        setPullState({
          isPulling: false,
          isRefreshing: false,
          pullDistance: 0,
          shouldRefresh: false,
        });
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, pullState.isPulling, pullState.isRefreshing, pullState.shouldRefresh, onRefresh, threshold, maxPullDistance]);

  return [containerRef, pullState];
}
