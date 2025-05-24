import AuthForm from "../../../Features/Auth"
import { useUnit } from "effector-react";
import { $isAuthenticated } from "../../../Entities/session";
const AuthPage = () => {
    const isAuth = useUnit($isAuthenticated);
    return (
        <section style={{padding: '40px 0'}} className="auth">
            <div className="container auth__inner">
                {!isAuth 
                    ? 
                    <AuthForm /> 
                    :
                    <h2 style={{textAlign: 'center'}}>Вы авторизованы</h2>
                }
            </div>
        </section>
    );
}

export default AuthPage;