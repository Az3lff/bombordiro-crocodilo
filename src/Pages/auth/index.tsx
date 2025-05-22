import AuthForm from "../../Features/Auth";

const AuthPage = () => {
  return (
    <section style={{padding: '40px 0', display: 'flex', justifyContent: 'center'}} className="auth">
      <div className="container auth__inner">
        <AuthForm />
      </div>
    </section>
  );
};
export default AuthPage;