import { UserInterface } from "@/interfaces/UserInterface";
import { useState } from "react";

const SingleUserRenderer = ({userId}:{userId:string}) => {
    const [user, setUser] = useState<UserInterface | null>(null)
    return ( <div></div> );
}
 
export default SingleUserRenderer;