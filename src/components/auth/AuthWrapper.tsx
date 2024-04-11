import "../../styles/components/auth_page.css";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="auth-wrapper">
            <img src="/images/image1.png" className="auth-image" alt="" />
            {children}
        </main>
    );
};

export default AuthWrapper;
