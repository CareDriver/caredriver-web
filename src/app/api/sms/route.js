import { NextResponse } from "next/server";
// import { TWILIO_PHONE, TWILIO_CLIENT } from "../../../twilio/Config.ts";

export async function POST(request) {
    try {
        const { code, phone } = await request.json();
        const url = "https://gate.whapi.cloud/messages/text";
        const options = {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                authorization: "Bearer yRU7YFfWWJeDot5OE1Arx7ElJ0oVwcjD",
            },
            body: JSON.stringify({
                typing_time: 0,
                to: phone.replace("+", ""),
                body: JSON.stringify(`Tu codigo de verificacion es ${code}`),
            }),
        };
        await fetch(url, options);
        return NextResponse.json({ messsage: "codigo enviado" });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "error, intentalo de nuevo por favor" });
    }
}

/* 
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
*/
