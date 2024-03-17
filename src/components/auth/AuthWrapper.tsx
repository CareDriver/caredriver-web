import "../../styles/components/auth_page.css";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="auth-wrapper">
            <div className="auth-image">image</div>
            {children}
        </main>
    );
};

export default AuthWrapper;
