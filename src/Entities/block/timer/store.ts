export const timerStarted = () => {
    (window as any).__timerStart = performance.now();
};

export const timerReset = () => {
    (window as any).__timerStart = performance.now();
};