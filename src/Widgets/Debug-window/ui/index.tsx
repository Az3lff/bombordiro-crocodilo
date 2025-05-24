import { useUnit } from 'effector-react';
import { useState } from 'react';
import styled from 'styled-components';
import { $messageStore } from '../../../Entities/debug-window/store';

const CollapsiblePanel = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const messages = useUnit($messageStore)

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
                {isCollapsed ? '▶ Развернуть' : '▼ Свернуть'}
            </div>
            {!isCollapsed && (
                <div style={{ padding: '10px', color: '#fafafa', width: 500, overflowY: 'scroll', height: 349 }}>
                    {messages.length ? messages?.map((message) => <div style={{ marginBottom: 10, display: 'flex', gap: 10 }}>
                        {
                            message?.map((el) => <div>{el}</div>)
                        }
                    </div>) : <div>Сообщений нет...</div>}
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
    bottom: 0px;
    right: 20px;
    z-index: 10;
    transition-duration: 500;
    height: ${(props) => props.isCollapsed ? '33px' : '400px'};
`