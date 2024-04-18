import { NextResponse } from "next/server";
import twilio from "twilio";

const SID = process.env.PUBLIC_NEXT_SID;
const TOKEN = process.env.PUBLIC_NEXT_TOKEN;
const PHONE = process.env.PUBLIC_NEXT_PHONE;

const client = twilio(SID, TOKEN);

export async function POST(request) {
    try {
        const { code, toPhone } = await request.json();
        const messsage = await client.messages.create({
            body: `Tu codigo de verificacion es ${code}`,
            from: PHONE,
            to: toPhone,
        });

        return NextResponse.json(messsage.status);
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "error, intentalo de nuevo por favor" });
    }
    /* try {
        const { phoneNumber } = await request.json();
        const message = await client.verify.v2.services(SERVICE_ID).verifications.create({
            to: phoneNumber,
            channel: "whatsapp",
        });
        return NextResponse.json(message);
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Error al enviar el mensaje" });
    } */
}
