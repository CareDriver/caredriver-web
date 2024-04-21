import { NextResponse } from "next/server";
import { TWILIO_PHONE, TWILIO_CLIENT } from "../../../twilio/Config.ts";

export async function POST(request) {
    try {
        const { code, toPhone } = await request.json();
        const messsage = await TWILIO_CLIENT.messages.create({
            body: `Tu codigo de verificacion es ${code}`,
            from: TWILIO_PHONE,
            to: toPhone,
        });

        return NextResponse.json(messsage.status);
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "error, intentalo de nuevo por favor" });
    }
}
