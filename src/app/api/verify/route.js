import { NextResponse } from "next/server";
import twilio from "twilio";

const SID = process.env.PUBLIC_NEXT_SID;
const TOKEN = process.env.PUBLIC_NEXT_TOKEN;
const SERVICE_ID = process.env.PUBLIC_NEXT_SERVICE_ID;

const client = twilio(SID, TOKEN);

export async function POST(request) {
    try {
        const { phoneNumber, code } = await request.json();
        const { status } = await client.verify.v2
            .services(SERVICE_ID)
            .verificationChecks.create({
                to: phoneNumber,
                code,
            });
        return NextResponse.json(status);
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Error al enviar el mensaje" });
    }
}
