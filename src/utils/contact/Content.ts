export const getGreeting = () => {
    var hour = new Date().getHours();
    var greeting;

    if (hour < 12) {
        greeting = "Buenos días;";
    } else if (hour < 18) {
        greeting = "Buenas tardes;";
    } else {
        greeting = "Buenas noches;";
    }

    return greeting;
};
