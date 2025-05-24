export const initializePauseControls = () => {
    window.__isPaused = false;
    window.__pauseResolvers = [];

    window.pauseExecution = function () {
        return new Promise(resolve => {
            if (this.__isPaused) {
                this.__pauseResolvers.push(resolve);
            } else {
                this.__isPaused = true;
                resolve();
            }
        });
    };

    window.resumeExecution = function () {
        this.__isPaused = false;
        while (this.__pauseResolvers.length) {
            const resolver = this.__pauseResolvers.pop()!;
            resolver();
        }
    };

    window.pauseIfNeeded = async function () {
        if (this.__isPaused) {
            await this.pauseExecution();
        }
    };

};
