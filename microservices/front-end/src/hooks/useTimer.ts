import { useCallback, useEffect, useState } from "react";

/**
 * Uses a timer to count the number of seconds elapsed.
 */
const useTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!isRunning) {
      return;
    }
    const interval = setInterval(() => setTimeElapsed(n => n + 1), 1000)
    const cleanup = () => {
      clearInterval(interval);
    };
    return cleanup;
  }, [isRunning])

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeElapsed(0);
  }, [])

  return {
    timeElapsed,
    isRunning,
    start,
    stop,
    reset
  }
}

export default useTimer;
