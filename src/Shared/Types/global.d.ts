interface Window {
    player: any;
    movePlayerForward: any;
    stopMoving: any
    turns: any
    turnRight: any
    turnLeft: any
    setMotorSpeed: any
    setBothMotorSpeed: any
    delay: any
    setBothSpeeds: any
    addMessage: any
    __timerStart: any
    __isPaused: boolean;
    __shouldAbort: boolean;
    __pauseResolvers: (() => void)[];
    pauseExecution: () => Promise<void>;
    resumeExecution: () => void;
    pauseIfNeeded: () => Promise<void>;
    abortExecution: () => void;
}