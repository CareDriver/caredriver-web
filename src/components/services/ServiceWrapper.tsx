import SideBar from "../navigation/sidebar/Sidebar";

const ServiceWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="wrapper">
            {children}
        </main>
    );
};

export default ServiceWrapper;
