"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AdvancedLazyWrapperProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  fallback?: ReactNode;
  className?: string;
  animation?: "fade" | "slide" | "scale" | "none";
  delay?: number;
}

const defaultFallback = (
  <div className="w-full h-32 bg-zinc-800/30 animate-pulse rounded-lg flex items-center justify-center">
    <div className="text-zinc-400">טוען...</div>
  </div>
);

export function AdvancedLazyWrapper({
  children,
  threshold = 0.1,
  rootMargin = "50px",
  fallback = defaultFallback,
  className = "",
  animation = "fade",
  delay = 0,
}: AdvancedLazyWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              setHasLoaded(true);
            }, delay);
          } else {
            setIsVisible(true);
            setHasLoaded(true);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, delay, hasLoaded]);

  const getAnimationProps = () => {
    switch (animation) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
        };
      case "slide":
        return {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -30 },
          transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
        };
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 },
          transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
        };
      case "none":
        return {};
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
        };
    }
  };

  return (
    <div ref={elementRef} className={className}>
      <AnimatePresence mode="wait">
        {!isVisible ? (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {fallback}
          </motion.div>
        ) : (
          <motion.div key="content" {...getAnimationProps()}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

