const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <div>image</div>
            {children}
        </main>
    );
};

export default AuthWrapper;
