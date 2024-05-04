import { ServiceReqState } from "@/interfaces/Services";

interface Data {
    title: string;
    description: string;
    state: ServiceReqState;
}

const ServiceHeader = ({ data }: { data: Data }) => {
    return (
        <div className="margin-bottom-25">
            <h1
                className={`text | big bolder max-width-90 ${
                    data.state === ServiceReqState.Refused && "red"
                }`}
            >
                {data.title}
            </h1>
            <p className="text | light">{data.description}</p>
        </div>
    );
};

export default ServiceHeader;
