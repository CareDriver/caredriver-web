import { firestore } from "../firebase/FirebaseConfig";
import {
    collection,
    addDoc,
    DocumentReference,
    getDoc,
    doc,
    setDoc,
} from "firebase/firestore";
import { UserInterface } from "../interfaces/UserInterface";

const usersCollection = collection(firestore, "users");

/**
 * Saves a user to the database.
 *
 * @param {string} uid - The unique identifier of the user.
 * @param {Omit<UserInterface, 'id'>} userData - The data of the user to be saved.
 * @returns {Promise<DocumentReference>} A promise that resolves to the reference of the saved user document.
 * @throws {Error} If there is an error adding the user.
 */
const saveUser = async (
    uid: string,
    userData: Omit<UserInterface, "id">,
): Promise<DocumentReference> => {
    try {
        const userRef = doc(usersCollection, uid);
        await setDoc(userRef, userData);
        console.log("User added with ID: ", userRef.id);
        return userRef;
    } catch (error) {
        console.error("Error adding user: ", error);
        throw error;
    }
};

/**
 * Retrieves a user by their ID.
 * @param userId - The ID of the user to retrieve.
 * @returns A Promise that resolves to the user object if found, or undefined if not found.
 * @throws If there was an error retrieving the user.
 */
const getUserById = async (userId: string): Promise<UserInterface | undefined> => {
    try {
        const userDoc = await getDoc(doc(usersCollection, userId));
        if (userDoc.exists()) {
            return userDoc.data() as UserInterface;
        }
        return undefined;
    } catch (error) {
        throw error;
    }
};

export { saveUser, getUserById };
