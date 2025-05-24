import { useEffect, useRef, useState } from 'react';
import { Button, Space, Statistic } from 'antd'
import { $isRunning, $milliseconds, pause, reset, start, stop } from '../../Entities/timer/store';
import { useUnit } from 'effector-react';

const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;

    const pad = (n: number, z = 2) => n.toString().padStart(z, '0');

    return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds, 3)}`;
};

export const TimerComponent = () => {

    const [milliseconds, isRunning] = useUnit([$milliseconds, $isRunning]);
    return (
        <div style={{
            position: 'absolute',
            top: 10,
            right: 300,
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: '8px 16px',
            borderRadius: '4px',
            zIndex: 10,
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
            <Statistic value={formatTime(milliseconds)} />
        </div>
    );
};