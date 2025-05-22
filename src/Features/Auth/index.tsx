import React, { useState } from 'react';
import { useUnit } from 'effector-react';
import { loginFx, registerFx, $authError } from './model';
import type { LoginData, RegisterData } from './types';
import Button from '../../Shared/UI/Button';
import "./styles.css"

const AuthForm: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [form, setForm] = useState<Partial<RegisterData>>({});
  const error = useUnit($authError);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      const data: LoginData = {
        login: form.login || '',
        password: form.password || '',
      };
      loginFx(data);
    } else {
      const data: RegisterData = {
        login: form.login || '',
        password: form.password || '',
        firstName: form.firstName || '',
        secondName: form.secondName || '',
        inviteToken: form.inviteToken || '',
      };
      registerFx(data);
    }
  };

  return (
    <>
    <div className="auth-toggle">
        <button
            type="button"
            onClick={() => setIsLoginMode(true)}
            className={isLoginMode ? 'active' : ''}
        >
            Войти
        </button>
        <button
            type="button"
            onClick={() => setIsLoginMode(false)}
            className={!isLoginMode ? 'active' : ''}
            disabled={false}
        >
            Регистрация
        </button>
    </div>
    <form onSubmit={handleSubmit}>
        <div className="auth-content__wrapper">
            <input name="login" placeholder="Логин" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Пароль" onChange={handleChange} required />
            {!isLoginMode && (
                <>
                <input name="secondName" placeholder="Фамилия" onChange={handleChange} required />
                <input name="firstName" placeholder="Имя" onChange={handleChange} required />
                <input name="inviteToken" placeholder="Код приглашения" onChange={handleChange} required />
                </>
            )}
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
        <Button style={{width: '100%', marginTop: '10px'}} type="submit">{isLoginMode ? 'Войти' : 'Зарегистрироваться'}</Button>
    </form>
    </>
  );
};

export default AuthForm;