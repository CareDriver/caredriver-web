import CompanyNameGreenLight from "@/icons/company/CompanyNameGreenLight";
import HomeRedirector from "./HomeRedirector";

const HomePresentation = () => {
    return (
        <div className="home-sub-container | z-index-1 | gap-5">
            <span className="home-sub-container-name">
                <CompanyNameGreenLight />
            </span>
            <HomeRedirector />
        </div>
    );
};

export default HomePresentation;
