/**
 * A custom hook that detects if the current screen size is below the medium breakpoint (768px).
 * It listens to window resize events and updates the state accordingly.
 * 
 * @returns {boolean} Returns true if the screen width is less than 768px, false otherwise
 */

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
