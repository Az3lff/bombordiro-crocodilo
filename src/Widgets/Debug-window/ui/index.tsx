import { useUnit } from 'effector-react';
import { useState } from 'react';
import styled from 'styled-components';
import { $messageStore } from '../../../Entities/debug-window/store';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const CollapsiblePanel = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const messages = useUnit($messageStore)
    function formatTime(ms: number) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = ms % 1000;

        return [
            String(minutes).padStart(2, '0'),
            String(seconds).padStart(2, '0'),
            String(milliseconds).padStart(3, '0')
        ].join(':');
    }

    return (
        <Container isCollapsed={isCollapsed}>
            <div
                style={{
                    padding: '5px 16px',
                    background: '#fff',
                    border: '1px solid #fafafa',
                    cursor: 'pointer',
                    textAlign: 'right',
                }}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? <span><UpOutlined /> Развернуть</span> : <span><DownOutlined /> Свернуть</span>}
            </div>
            {!isCollapsed && (
                <div style={{ padding: '10px', color: '#fafafa', width: 500, overflowY: 'scroll', height: 371.5 }}>
                    {messages.length ? messages?.map((message) => {
                        const timer = (Date.now() - window.__timerStart)
                        return <div style={{ marginBottom: 10, display: 'flex', gap: 10 }}>
                            <Typography>{formatTime(timer)}:</Typography>
                            {
                                message?.map((el) => <MessageBlock>{el}</MessageBlock>)
                            }
                        </div>
                    }) : <div>Сообщений нет...</div>}
                </div>
            )}

        </Container>
    );
}

export default CollapsiblePanel

interface ContainerProps {
    isCollapsed: boolean
}
const Container = styled.div<ContainerProps>`
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #000;
    position: absolute;
    bottom: 4px;
    right: 20px;
    z-index: 10;
    transition-duration: 500;
    height: ${(props) => props.isCollapsed ? '28px' : '400px'};
`

const MessageBlock = styled(Typography)`
    color: #0dff00;
`