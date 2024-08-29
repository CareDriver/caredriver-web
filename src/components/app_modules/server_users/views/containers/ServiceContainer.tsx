const ServiceContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="wrapper">
            {children}
        </main>
    );
};

export default ServiceContainer;
