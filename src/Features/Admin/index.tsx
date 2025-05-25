import React, { useState } from 'react';
import Button from '../../Shared/UI/Button';
import { useUnit } from 'effector-react';
import { Button as StyledButton } from 'antd'
import { generateTokenFx, $tokenError } from './model';
import type { TokenRole } from './types';
import "./styles.css"
import { Tooltip } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { userLoggedOut } from '../../Entities/session';

const roleOptions: { value: TokenRole; label: string }[] = [
    { value: 'admin', label: 'Администратор' },
    { value: 'teacher', label: 'Преподаватель' },
];
const GenerateTokenForm: React.FC = () => {
    const handleLogout = () => {
        userLoggedOut();
    }
    const [role, setRole] = useState<TokenRole>('admin');
    const [inviteToken, setInviteToken] = useState<string | null>('');
    const error = useUnit($tokenError);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await generateTokenFx(role);
            setInviteToken(response);
        } catch {
            setInviteToken(null);
        }
    };

    return (
        <>
            <Tooltip title={'Выйти из системы'}>
                <StyledButton style={{ position: 'absolute', top: 10, left: 10 }} onClick={handleLogout} icon={<LogoutOutlined />} />
            </Tooltip>
            <section className="invite">
                <div className="container invite__inner">
                    <h2 className="invite__title">Генерация токена</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="invite-content__wrapper">

                            <div className="form-group">
                                <label htmlFor="role">Роль:</label>
                                <select value={role} onChange={(e) => setRole(e.target.value as TokenRole)}>
                                    {roleOptions.map(({ value, label }) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group result">
                                {inviteToken && (
                                    <div className="invite-result">
                                        <span>Сгенерированный токен:</span>
                                        <code>{inviteToken}</code>
                                    </div>
                                )}
                                {error && <span className="error-message">{error}</span>}
                            </div>
                        </div>
                        <Button style={{ width: "100%" }} type="submit">Получить токен</Button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default GenerateTokenForm;