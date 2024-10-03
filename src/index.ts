interface PerfCheckerParam {
  timeout?: number;
  threshold?: number;
  samplingTimes?: number;
  callback?: (fps: number) => void;
}


export const perfChecker = (param?: PerfCheckerParam) => {
  const {
    timeout = 1000,
    threshold = 24,
    samplingTimes = 3,
    callback = () => { },
  } = param || {};

  let initialTimestamp = performance.now();
  let frame = 0;
  let timer: number;
  let belowLowestFrames = 0;
  return () => {
    const checker = () => {
      const now = performance.now();
      frame += 1;
      if (now > 1000 + initialTimestamp) {
        const fps = Math.round(1000 * (frame / (now - initialTimestamp)));
        frame = 0;
        initialTimestamp = now;
        if (fps < threshold) {
          belowLowestFrames += 1;
        } else {
          belowLowestFrames = 0;
        }
        console.info('[perf-checker] current fps: %s, belowLowestFrames: %s', fps, belowLowestFrames);

        if (belowLowestFrames >= samplingTimes) {
          callback(fps);
        }
      }
      window.cancelAnimationFrame(timer);
      timer = window.requestAnimationFrame(checker);
    }
    timer = window.requestAnimationFrame(checker);

    setTimeout(() => {
      window.cancelAnimationFrame(timer);
    }, timeout);
  }
};
