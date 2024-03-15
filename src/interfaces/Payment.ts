import { Timestamp } from "firebase/firestore";

export interface Price {
    currency: "Bs. (BOB)"; // currency of the debt, just Bolivians for the moment
    amount: number; // amount of the debt
}

// This interface will be used for the payments made by the user and also for the debt of the user with the app
export interface Payment extends Price {
    date: Timestamp; // when used for a debt: last time the user paid to the app, and when user for a payment it will register the date the payment is being done
}
