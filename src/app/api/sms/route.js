import { NextResponse } from "next/server";

// export const runtime = 'edge';

export async function POST() {
  try {
    // const { phone, message } = await request.json();
    // const url = "https://gate.whapi.cloud/messages/text";
    // const options = {
    //   method: "POST",
    //   headers: {
    //     accept: "application/json",
    //     "content-type": "application/json",
    //     authorization: `Bearer ${process.env.WHAPI_TOKEN}`,
    //   },
    //   body: JSON.stringify({
    //     typing_time: 0,
    //     to: phone.replace("+", ""),
    //     body: message,
    //   }),
    // };
    // await fetch(url, options);
    return NextResponse.json({ messsage: "código enviado" });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "error, inténtalo de nuevo por favor" });
  }
}
