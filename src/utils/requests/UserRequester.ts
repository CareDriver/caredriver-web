import { firestore } from "../../firebase/FirebaseConfig";
import {
    collection,
    DocumentReference,
    getDoc,
    doc,
    setDoc,
    updateDoc,
    where,
    query,
    getDocs,
    DocumentSnapshot,
    orderBy,
    limit,
    startAfter,
    endBefore,
    limitToLast,
    getCountFromServer,
    and,
    or,
} from "firebase/firestore";
import { UserInterface } from "../../interfaces/UserInterface";

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
    userData: UserInterface,
): Promise<DocumentReference> => {
    try {
        const userRef = doc(usersCollection, uid);
        await setDoc(userRef, userData);
        return userRef;
    } catch (error) {
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

/**
 * Updates a user document in the database.
 *
 * @param {string} userId - The ID of the user document to update.
 * @param {Partial<UserInterface>} newData - The partial data to update in the user document.
 * @returns {Promise<void>} A promise that resolves when the document is successfully updated.
 * @throws {Error} If there is an error updating the user document.
 */
const updateUser = async (
    userId: string,
    newData: Partial<UserInterface>,
): Promise<void> => {
    try {
        const userRef = doc(usersCollection, userId);
        await updateDoc(userRef, newData);
    } catch (error) {
        throw error;
    }
};

const checkEmailExists = async (email: string): Promise<number> => {
    try {
        const q = query(
            usersCollection,
            where("email", "==", email),
            where("deleted", "==", false),
        );

        const docs = await getDocs(q);
        var size = 0;
        docs.forEach(() => {
            size++;
        });

        return size;
    } catch (error) {
        throw error;
    }
};

// GET ALL USERS WITH PAGINATION

export const getAllUsersPaginated = async (
    direction: "next" | "prev" | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot,
    numPerPage: number = 8,
) => {
    let dataQuery = query(
        usersCollection,
        orderBy("fullName"),
        limit(numPerPage),
        where("deleted", "==", false),
    );

    if (direction === "next" && startAfterDoc) {
        dataQuery = query(dataQuery, startAfter(startAfterDoc));
    } else if (direction === "prev" && endBeforeDoc) {
        dataQuery = query(
            usersCollection,
            orderBy("fullName"),
            endBefore(endBeforeDoc),
            limitToLast(numPerPage),
            where("deleted", "==", false),
        );
    }

    const productsSnapshot = await getDocs(dataQuery);
    const products = productsSnapshot.docs.map((doc) => doc.data());

    return {
        result: products as UserInterface[],
        lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1],
        firstDoc: productsSnapshot.docs[0],
    };
};

export const getAllUsersNumPages = async (numPerPages: number): Promise<number> => {
    const count = await getCountFromServer(
        query(usersCollection, where("deleted", "==", false)),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};

// GET ALL SEARCH USERS PAGINATED

export const getSearchUsersPaginated = async (
    searchField: string,
    direction: "next" | "prev" | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot,
    numPerPage: number = 8,
) => {
    let dataQuery = query(
        usersCollection,
        and(
            where("deleted", "==", false),
            or(
                where("fullName", "==", searchField),
                where("email", "==", searchField),
                where("phoneNumber", "==", searchField),
            ),
        ),
        orderBy("fullName"),
        limit(numPerPage),
    );

    if (direction === "next" && startAfterDoc) {
        dataQuery = query(dataQuery, startAfter(startAfterDoc));
    } else if (direction === "prev" && endBeforeDoc) {
        dataQuery = query(
            usersCollection,
            and(
                where("deleted", "==", false),
                or(
                    where("fullName", "==", searchField),
                    where("email", "==", searchField),
                    where("phoneNumber", "==", searchField),
                ),
            ),
            orderBy("fullName"),
            endBefore(endBeforeDoc),
            limitToLast(numPerPage),
        );
    }

    const productsSnapshot = await getDocs(dataQuery);
    const products = productsSnapshot.docs.map((doc) => doc.data());

    return {
        result: products as UserInterface[],
        lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1],
        firstDoc: productsSnapshot.docs[0],
    };
};

export const getSearchUsersNumPages = async (
    numPerPages: number,
    searchField: string,
): Promise<number> => {
    const count = await getCountFromServer(
        query(
            usersCollection,
            and(
                where("deleted", "==", false),
                or(
                    where("fullName", "==", searchField),
                    where("email", "==", searchField),
                    where("phoneNumber", "==", searchField),
                ),
            ),
        ),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};

export { saveUser, getUserById, updateUser, checkEmailExists };
