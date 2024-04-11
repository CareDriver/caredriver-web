import { ServiceReqState } from "@/interfaces/Services";

const ServiceHeader = ({
    title,
    description,
    state,
}: {
    title: string;
    description: string;
    state: ServiceReqState;
}) => {
    return (
        <>
            <h1
                className={`text | big bolder ${
                    state === ServiceReqState.Refused && "red"
                }`}
            >
                {title}
            </h1>
            <p>{description}</p>
        </>
    );
};

export default ServiceHeader;
