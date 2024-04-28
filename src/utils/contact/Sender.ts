export const sendWhatsapp = (number: string, message: string) => {
    var link = "https://wa.me/" + number + "?text=" + message;
    window.open(link, "_blank");
};

export const sendEmail = (recipient: string, subject: string, body: string) => {
    var email =
        "mailto:" +
        recipient +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    window.open(email, "_blank");
};
