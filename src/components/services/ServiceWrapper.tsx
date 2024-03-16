import SideBar from "../navigation/sidebar/Sidebar";

const ServiceWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <SideBar />
            {children}
        </main>
    );
};

export default ServiceWrapper;
