import { ServiceReqState } from "@/interfaces/Services";

interface Data {
    title: string;
    description: string;
    state: ServiceReqState;
}

const ServiceHeader = ({ data }: { data: Data }) => {
    return (
        <>
            <h1
                className={`text | big bolder ${
                    data.state === ServiceReqState.Refused && "red"
                }`}
            >
                {data.title}
            </h1>
            <p>{data.description}</p>
        </>
    );
};

export default ServiceHeader;
