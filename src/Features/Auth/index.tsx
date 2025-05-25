import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnit } from 'effector-react';
import { loginFx, registerFx, $authError } from './model';
import type { LoginData, RegisterData } from './types';
import Button from '../../Shared/UI/Button';
import "./styles.css"
import { userLoggedIn } from '../../Entities/session';

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
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
      const token = await loginFx(data);
      if (token) {
        userLoggedIn(token);
        setForm({});
        navigate('/lesson-selection');
      } else {
        console.error("Ошибка получения токена")
      }
    } else {
      const data: RegisterData = {
        login: form.login || '',
        password: form.password || '',
        first_name: form.first_name || '',
        second_name: form.second_name || '',
        invite_token: form.invite_token || '',
      };
        const response = await registerFx(data);
        if (response.status === 201 || response.status === 200) {
          if (response.data.auth_token) {
            userLoggedIn(response.data.auth_token);
            setForm({});
            navigate('/lesson-selection');
          } else {
            console.error("Ошибка получения токена")
          }
        }
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
                <input name="second_name" placeholder="Фамилия" onChange={handleChange} required />
                <input name="first_name" placeholder="Имя" onChange={handleChange} required />
                <input name="invite_token" placeholder="Код приглашения" onChange={handleChange} />
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