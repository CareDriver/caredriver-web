export const greeting = () => {
  var hour = new Date().getHours();
  var greeting;

  if (hour < 12) {
    greeting = "Buenos días 👋\n";
  } else if (hour < 18) {
    greeting = "Buenas tardes 👋\n";
  } else {
    greeting = "Buenas noches 👋\n";
  }

  return greeting;
};
