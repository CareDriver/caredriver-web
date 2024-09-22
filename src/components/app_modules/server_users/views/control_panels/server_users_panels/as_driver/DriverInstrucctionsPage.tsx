import { UserInterface } from "@/interfaces/UserInterface";
import DriverInstrucctions from "./DriverInstrucctions";

const DriverInstructionsPage = ({ user }: { user: UserInterface }) => {
    return (
        <div className="service-form-wrapper">
            <h1 className="text | big bolder">Trabaja como chofer con nosotros!</h1>
            <DriverInstrucctions user={user} />
        </div>
    );
};

export default DriverInstructionsPage;
