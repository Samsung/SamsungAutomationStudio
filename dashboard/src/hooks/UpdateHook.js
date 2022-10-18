import { useRef, useEffect } from "react";

function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}

export default function UpdateEffect(effect, dependencies) {
  const isMounted = useIsMounted();
  const isInitialMount = useRef(true);

  useEffect(() => {
    let effectCleanupFunc = () => {};

    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      effectCleanupFunc = effect() || effectCleanupFunc;
    }
    return () => {
      effectCleanupFunc();
      if (!isMounted.current) {
        isInitialMount.current = true;
      }
    };
  }, dependencies);
}
