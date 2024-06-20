import RealTime from "@/components/RealTime";
import { buildUrlDB } from "@/interfaces/RouteNavigationInterface";

const RealTimePage = () => {
    return (
        <RealTime
            databaseURL={buildUrlDB("driver-services", "cbba-bolivia")}
            serviceId="1aMgTX331lPYqz64Pgaf"
        />
    );
};

export default RealTimePage;
