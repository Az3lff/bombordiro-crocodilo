import { useState } from "react";
import styled from "styled-components";

export const PauseResumeControls = ({
    onPause,
    onResume,
    isRunning,
    onReset,
    onRun
}: {
    onPause: () => void;
    onResume: () => void;
    isRunning: boolean;
    onReset?: () => void;
    onRun?: () => void;
}) => {
    const [isPaused, setIsPaused] = useState(false);

    const handlePause = () => {
        window.pauseExecution();
        setIsPaused(true);
        onPause?.();
    };

    const handleResume = () => {
        window.resumeExecution();
        setIsPaused(false);
        onResume?.();
    };

    const handleReset = () => {
        window.abortExecution();
        setIsPaused(false);
        onReset?.();
    };

    return (
        <Container>
            {!isPaused ? <ControlButton
                background="#ff9800"
                onClick={handlePause}
                disabled={!isRunning || isPaused}
                style={{
                    opacity: (!isRunning || isPaused) ? 0.7 : 1,
                    cursor: (!isRunning || isPaused) ? 'not-allowed' : 'pointer'
                }}
            >
                ⏸ Пауза
            </ControlButton> : <ControlButton
                background="#4caf50"
                onClick={handleResume}
                disabled={!isRunning || !isPaused}
                style={{
                    opacity: (!isRunning || !isPaused) ? 0.7 : 1,
                    cursor: (!isRunning || !isPaused) ? 'not-allowed' : 'pointer'
                }}
            >
                ▶ Продолжить
            </ControlButton>}
            {isRunning ? <ControlButton
                onClick={handleReset}
                disabled={!isRunning}
                style={{
                    cursor: !isRunning ? 'not-allowed' : 'pointer',
                }}
                background="#f44336"
            >
                ⏹ Сброс
            </ControlButton> : <ControlButton style={{
                cursor: isRunning ? 'not-allowed' : 'pointer',
            }} background="#4caf50" onClick={onRun}>
                ▶ Запустить
            </ControlButton>}
        </Container>
    );
};

interface ControlButtonProps {
    background: string
}

const ControlButton = styled.button<ControlButtonProps>`
    padding: 10px 16px;
    border: none;
    border-radius: 4px;
    color: #fff;
    background-color: ${props => props.background};
`
const Container = styled.div`
    display: flex;
    gap: 10px;
    margin: 10px 0;
    position: absolute;
    top: 0;
    right: 20px;
`