import { useEffect, useState } from "react";

export default function useIsMdScreen() {
  const [isMdScreen, setIsMdScreen] = useState(false);

  useEffect(() => {
    const checkIsMdScreen = () => {
      setIsMdScreen(window.innerWidth < 768);
    };

    checkIsMdScreen();

    window.addEventListener("resize", checkIsMdScreen);
    return () => window.removeEventListener("resize", checkIsMdScreen);
  }, []);

  return isMdScreen;
}
