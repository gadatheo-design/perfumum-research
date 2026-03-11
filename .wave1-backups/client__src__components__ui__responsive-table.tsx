// @ts-nocheck
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const hasOverflow = container.scrollWidth > container.clientWidth;
      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
      
      setShowScrollIndicator(hasOverflow && !isAtEnd);
      setIsScrolledToEnd(isAtEnd);
    };

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [children]);

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className={cn(
          "overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
          className
        )}
      >
        {children}
      </div>
      
      {/* Scroll Indicator - Mobile only */}
      {showScrollIndicator && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none flex items-center justify-end pr-2 md:hidden">
          <div className="animate-pulse">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}
