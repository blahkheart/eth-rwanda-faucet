import { useEffect, useState } from "react";

// Utility hook to determine screen size
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<"xs" | "sm" | "md" | "lg">("lg");

  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth >= 1024) setScreenSize("lg");
      else if (window.innerWidth >= 768) setScreenSize("md");
      else if (window.innerWidth >= 640) setScreenSize("sm");
      else setScreenSize("xs");
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return screenSize;
}
