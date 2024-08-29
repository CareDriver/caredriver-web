import { greeting } from "@/utils/senders/Greeter";
import { sendEmail, sendWhatsapp } from "@/utils/senders/Sender";

export function contactUserByEmail(userEmail: string): void {
    let message = greeting();
    let subject = "Comunicado";
    sendEmail(userEmail, subject, message);
}

export function contactUserByWhatsapp(userPhone: string): void {
    let message = greeting();
    sendWhatsapp(userPhone, message);
}
