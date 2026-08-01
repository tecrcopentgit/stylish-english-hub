"use client";

import { useEffect } from "react";
import AOS from "aos";

export default function ClientInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Initialize AOS safely
    AOS.init({
      duration: 1000,
      once: false,
      easing: "ease-out",
      offset: 10, // Triggers slightly earlier so elements don't get trapped
    });

    // 2. Force recalculation after Next.js finishes building/rendering the client layout
    const handleLoad = () => {
      AOS.refresh();
    };

    if (document.readyState === "complete") {
      AOS.refresh();
    } else {
      window.addEventListener("load", handleLoad);
    }

    // 3. Clean up the event reference
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return <>{children}</>;
}
