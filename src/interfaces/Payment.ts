import { Timestamp } from "firebase/firestore";
import { ServiceType } from "./Services";

export interface Price {
    currency: "Bs. (BOB)"; // currency of the debt, just Bolivians for the moment
    amount: number; // amount of the debt
}

// This interface will be used for the payments made by the user and also for the debt of the user with the app
export interface Payment extends Price {
    date: Timestamp; // when used for a debt: last time the user paid to the app, and when user for a payment it will register the date the payment is being done
}

export interface BalanceHistory extends Payment {
    balanceRechargeId?: string;
    note?: string;
    newBalance?: Price;
    serviceType?: ServiceType;
    serviceFakeId?: string;
}

export const defaultBalance: Price = {
    currency: "Bs. (BOB)",
    amount: 0,
};

export const defaultMinBalance: Price = {
    currency: "Bs. (BOB)",
    amount: -10,
};

export interface BalanceHistoryItem {
    id: string;
    bankTransactionNumber?: string;
    modificationReason?: string;
    dateTime: Timestamp;
    previousBalance: Price;
    oldBalance: Price;
    userWhoChanged: string;
}

export interface DebtHistory extends Payment {
    paidDebtId?: string;
    note?: string;
    newDebt?: Price;
    transactionNumber: string;
}

export interface ComissionHistory {
    serviceId: string;
    serviceType: ServiceType;
    amount: Price;
}

export const currencyList = ["Bs. (BOB)"];
