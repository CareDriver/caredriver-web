'use client'

import { parseBoliviaPhone } from "@/utils/helpers/PhoneHelper";
import { useEffect } from "react";

const Prove = () => {

    useEffect(() => {
        console.log(parseBoliviaPhone("+59176466491"));
    }, []);

    return ( <div></div> );
}
 
export default Prove;