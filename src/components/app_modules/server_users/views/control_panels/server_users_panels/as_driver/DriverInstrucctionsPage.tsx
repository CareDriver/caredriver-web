import { UserInterface } from "@/interfaces/UserInterface";
import DriverInstrucctions from "./DriverInstrucctions";

const DriverInstructionsPage = ({ user }: { user: UserInterface }) => {
    return (
        <div className="service-form-wrapper | max-height-100">
            <h1 className="text | big bolder">Trabaja como chofer con nosotros!</h1>
            <DriverInstrucctions user={user} />
            <span className="circles-right-bottomv2 green"></span>
        </div>
    );
};

export default DriverInstructionsPage;
