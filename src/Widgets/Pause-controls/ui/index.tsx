import { Button, Tooltip } from "antd";
import { useState } from "react";
import styled from "styled-components";
import { CaretRightOutlined, PauseOutlined, RedoOutlined } from '@ant-design/icons'

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
            {!isPaused ? <Tooltip title={'Пауза'}>
                <Button
                    // background="#ff9800"
                    onClick={handlePause}
                    disabled={!isRunning || isPaused}
                    style={{
                        opacity: (!isRunning || isPaused) ? 0.7 : 1,
                        cursor: (!isRunning || isPaused) ? 'not-allowed' : 'pointer'
                    }}
                    icon={<PauseOutlined />}
                />
            </Tooltip>
                : <Tooltip title={'Продолжить'}>
                    <Button
                        // background="#4caf50"
                        onClick={handleResume}
                        disabled={!isRunning || !isPaused}
                        style={{
                            opacity: (!isRunning || !isPaused) ? 0.7 : 1,
                            cursor: (!isRunning || !isPaused) ? 'not-allowed' : 'pointer'
                        }}
                        icon={<CaretRightOutlined />}
                    />
                </Tooltip>}
            {isRunning ? <Tooltip title={'Сбросить'}>
                <Button
                    onClick={handleReset}
                    disabled={!isRunning}
                    style={{
                        cursor: !isRunning ? 'not-allowed' : 'pointer',
                    }}
                    icon={<RedoOutlined />}
                // background="#f44336"
                />
            </Tooltip>
                : <Tooltip title={'Запустить'}>
                    <Button style={{
                        cursor: isRunning ? 'not-allowed' : 'pointer',
                    }}
                        onClick={onRun}
                        icon={<CaretRightOutlined />}
                    />
                </Tooltip>}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    gap: 10px;
    margin: 10px 0;
    position: absolute;
    top: 0;
    right: 20px;
`