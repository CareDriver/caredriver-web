import { firestore } from "../../../../firebase/FirebaseConfig";
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
  getCountFromServer,
  and,
  or,
  Unsubscribe,
} from "firebase/firestore";
import { UserInterface, UserRole } from "../../../../interfaces/UserInterface";
import {
  getDocInRealTime,
  RealTimeResponse,
} from "@/utils/requesters/RealTimeFetcher";
import { generateKeywords, normalizeText } from "@/utils/helpers/StringHelper";
import { Services } from "@/interfaces/Services";
import { Locations } from "@/interfaces/Locations";

const usersCollection = collection(firestore, "users");

export interface UserSearchFilters {
  service?: Services;
  location?: Locations;
}

const getNameSearchTerms = (searchInput: string): string[] => {
  const normalized = normalizeText(searchInput);
  if (!normalized) {
    return [];
  }

  const terms = new Set<string>([normalized]);
  normalized
    .split(/\s+/)
    .filter(Boolean)
    .forEach((term) => terms.add(term));

  return Array.from(terms);
};

export const getUserByEmail = async (
  email: string,
): Promise<UserInterface | undefined> => {
  try {
    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as UserInterface;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching user by email: ", error);
    throw error;
  }
};

export const getUserNoDeletedByEmail = async (
  email: string,
): Promise<UserInterface | undefined> => {
  try {
    const q = query(
      usersCollection,
      where("email", "==", email),
      where("deleted", "==", false),
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as UserInterface;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching user by email: ", error);
    throw error;
  }
};

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
    const data: UserInterface = {
      ...userData,
      fullNameArrayLower: generateKeywords(userData.fullName),
    };
    await setDoc(userRef, data);
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
const getUserById = async (
  userId: string,
): Promise<UserInterface | undefined> => {
  try {
    const userDoc = await getDoc(doc(usersCollection, userId));
    if (userDoc.exists()) {
      let user = userDoc.data() as UserInterface;
      user.id = userId;
      return user;
    }
    return undefined;
  } catch (error) {
    throw error;
  }
};

export const getUserByFakeId = async (
  fakeUserId: string,
): Promise<UserInterface | undefined> => {
  try {
    const q = query(usersCollection, where("fakeId", "==", fakeUserId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      let userDoc = querySnapshot.docs[0];
      let user = userDoc.data() as UserInterface;
      user.id = userDoc.id;
      return user;
    }
    return undefined;
  } catch (error) {
    throw error;
  }
};

export const getUserByFakeIdInRealTime = async (
  fakeUserId: string,
  behavior: RealTimeResponse<UserInterface>,
): Promise<Unsubscribe> => {
  const q = query(usersCollection, where("fakeId", "==", fakeUserId));
  return await getDocInRealTime<UserInterface>(q, behavior);
};

export const getUsersByTheirIds = async (
  usersId: string[],
): Promise<UserInterface[]> => {
  const q = query(usersCollection, where("id", "in", usersId));
  const querySnapshot = await getDocs(q);
  const users: UserInterface[] = [];
  querySnapshot.forEach((doc) => {
    let user = doc.data() as UserInterface;
    user.id = doc.id;
    users.push(user);
  });

  return users;
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
    const q = query(usersCollection, where("email", "==", email));

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
  adminRole: UserRole | undefined,
  adminEmail: string,
  direction: "next" | "prev" | undefined,
  startAfterDoc?: DocumentSnapshot,
  numPerPage: number = 8,
  filters?: UserSearchFilters,
) => {
  let dataQuery;
  const constraints: any[] = [
    where("deleted", "==", false),
    where("email", "!=", adminEmail),
  ];

  if (filters?.location) {
    constraints.push(where("location", "==", filters.location));
  }

  if (adminRole && adminRole === UserRole.BalanceRecharge) {
    if (filters?.service) {
      constraints.push(where("services", "array-contains", filters.service));
    } else {
      constraints.push(
        where("services", "array-contains-any", [
          "Conductor",
          "Mecánico",
          "Remolque",
          "Lavadero",
        ]),
      );
    }
  } else if (filters?.service) {
    constraints.push(where("services", "array-contains", filters.service));
  }

  dataQuery = query(
    usersCollection,
    orderBy("fullName"),
    limit(numPerPage),
    ...constraints,
  );

  if (direction === "next" && startAfterDoc) {
    dataQuery = query(dataQuery, startAfter(startAfterDoc));
  } /* else if (direction === "prev" && endBeforeDoc) {
        dataQuery = query(
            usersCollection,
            orderBy("fullName"),
            endBefore(endBeforeDoc),
            limitToLast(numPerPage),
            where("deleted", "==", false),
            where("email", "!=", adminEmail),
        );
    } */

  const productsSnapshot = await getDocs(dataQuery);
  const products: UserInterface[] = productsSnapshot.docs.map((doc) => {
    var user = doc.data() as UserInterface;
    user.id = doc.id;
    return user;
  });

  return {
    result: products,
    lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1],
    firstDoc: productsSnapshot.docs[0],
  };
};

export const getAllUsersNumPages = async (
  adminRole: UserRole | undefined,
  adminEmail: string,
  numPerPages: number,
  filters?: UserSearchFilters,
): Promise<number> => {
  var dataQuery;
  const constraints: any[] = [
    where("deleted", "==", false),
    where("email", "!=", adminEmail),
  ];

  if (filters?.location) {
    constraints.push(where("location", "==", filters.location));
  }

  if (adminRole && adminRole === UserRole.BalanceRecharge) {
    if (filters?.service) {
      constraints.push(where("services", "array-contains", filters.service));
    } else {
      constraints.push(
        where("services", "array-contains-any", [
          "Conductor",
          "Mecánico",
          "Remolque",
          "Lavadero",
        ]),
      );
    }
  } else if (filters?.service) {
    constraints.push(where("services", "array-contains", filters.service));
  }

  dataQuery = query(usersCollection, ...constraints);

  const count = await getCountFromServer(dataQuery);
  const numPages = Math.ceil(count.data().count / numPerPages);
  return numPages;
};

// Helper function to generate phone search variations
const getPhoneSearchVariations = (searchInput: string): string[] => {
  const trimmed = searchInput.trim();
  const variations: Set<string> = new Set();

  // Add the number as is (without spaces)
  const clean = trimmed.replace(/\s+/g, "");
  variations.add(clean);

  // Add with +591 prefix
  if (!clean.startsWith("+591") && !clean.startsWith("+")) {
    variations.add("+591" + clean);
  }

  // Add with + prefix only
  if (!clean.startsWith("+")) {
    variations.add("+" + clean);
  }

  return Array.from(variations);
};

// GET ALL SEARCH USERS PAGINATED

export const getSearchUsersPaginated = async (
  adminRole: UserRole | undefined,
  adminEmail: string,
  searchField: string,
  direction: "next" | "prev" | undefined,
  startAfterDoc?: DocumentSnapshot,
  numPerPage: number = 8,
  filters?: UserSearchFilters,
) => {
  try {
    let dataQuery;
    const trimmedSearch = searchField.trim();
    const phoneVariations = getPhoneSearchVariations(searchField);
    const nameTerms = getNameSearchTerms(searchField).slice(0, 10);
    const lowerSearch = trimmedSearch.toLowerCase();

    const phoneConditions = phoneVariations.map((phone) =>
      where("phoneNumber", "==", phone),
    );

    const nameConditions = nameTerms.length
      ? [where("fullNameArrayLower", "array-contains-any", nameTerms)]
      : [];

    const searchConditions = [
      where("fullName", "==", trimmedSearch),
      where("email", "==", lowerSearch),
      ...nameConditions,
      ...phoneConditions,
    ];

    console.log("[UserSearch][Paginated] params", {
      adminRole,
      adminEmail,
      searchField,
      trimmedSearch,
      lowerSearch,
      phoneVariations,
      nameTerms,
      direction,
      hasStartAfterDoc: !!startAfterDoc,
      numPerPage,
      filters,
    });

    const baseConstraints: any[] = [
      where("deleted", "==", false),
      where("email", "!=", adminEmail),
    ];

    if (filters?.location) {
      baseConstraints.push(where("location", "==", filters.location));
    }

    if (adminRole && adminRole === UserRole.BalanceRecharge) {
      if (filters?.service) {
        baseConstraints.push(
          where("services", "array-contains", filters.service),
        );
      } else {
        baseConstraints.push(
          where("services", "array-contains-any", [
            "Conductor",
            "Mecánico",
            "Remolque",
            "Lavadero",
          ]),
        );
      }

      dataQuery = query(
        usersCollection,
        and(...baseConstraints, or(...searchConditions)),
        orderBy("fullName"),
        limit(numPerPage),
      );
    } else {
      if (filters?.service) {
        baseConstraints.push(
          where("services", "array-contains", filters.service),
        );
      }

      dataQuery = query(
        usersCollection,
        and(...baseConstraints, or(...searchConditions)),
        orderBy("fullName"),
        limit(numPerPage),
      );
    }

    if (direction === "next" && startAfterDoc) {
      dataQuery = query(dataQuery, startAfter(startAfterDoc));
    }

    const productsSnapshot = await getDocs(dataQuery);
    const products: UserInterface[] = productsSnapshot.docs.map((doc) => {
      var user = doc.data() as UserInterface;
      user.id = doc.id;
      return user;
    });

    console.log("[UserSearch][Paginated] results", {
      count: products.length,
      hasLastDoc: !!productsSnapshot.docs[productsSnapshot.docs.length - 1],
      hasFirstDoc: !!productsSnapshot.docs[0],
    });

    return {
      result: products,
      lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1],
      firstDoc: productsSnapshot.docs[0],
    };
  } catch (error) {
    console.error("[UserSearch][Paginated] error", {
      adminRole,
      adminEmail,
      searchField,
      direction,
      numPerPage,
      filters,
      error,
    });
    throw error;
  }
};

export const getSearchUsersNumPages = async (
  adminRole: UserRole | undefined,
  adminEmail: string,
  numPerPages: number,
  searchField: string,
  filters?: UserSearchFilters,
): Promise<number> => {
  try {
    let dataQuery;
    const trimmedSearch = searchField.trim();
    const phoneVariations = getPhoneSearchVariations(searchField);
    const nameTerms = getNameSearchTerms(searchField).slice(0, 10);
    const lowerSearch = trimmedSearch.toLowerCase();

    const phoneConditions = phoneVariations.map((phone) =>
      where("phoneNumber", "==", phone),
    );

    const nameConditions = nameTerms.length
      ? [where("fullNameArrayLower", "array-contains-any", nameTerms)]
      : [];

    const searchConditions = [
      where("fullName", "==", trimmedSearch),
      where("email", "==", lowerSearch),
      ...nameConditions,
      ...phoneConditions,
    ];

    console.log("[UserSearch][NumPages] params", {
      adminRole,
      adminEmail,
      searchField,
      trimmedSearch,
      lowerSearch,
      phoneVariations,
      nameTerms,
      numPerPages,
      filters,
    });

    const baseConstraints: any[] = [
      where("deleted", "==", false),
      where("email", "!=", adminEmail),
    ];

    if (filters?.location) {
      baseConstraints.push(where("location", "==", filters.location));
    }

    if (adminRole && adminRole === UserRole.BalanceRecharge) {
      if (filters?.service) {
        baseConstraints.push(
          where("services", "array-contains", filters.service),
        );
      } else {
        baseConstraints.push(
          where("services", "array-contains-any", [
            "Conductor",
            "Mecánico",
            "Remolque",
            "Lavadero",
          ]),
        );
      }

      dataQuery = query(
        usersCollection,
        and(...baseConstraints, or(...searchConditions)),
      );
    } else {
      if (filters?.service) {
        baseConstraints.push(
          where("services", "array-contains", filters.service),
        );
      }

      dataQuery = query(
        usersCollection,
        and(...baseConstraints, or(...searchConditions)),
      );
    }

    const count = await getCountFromServer(dataQuery);
    const numPages = Math.ceil(count.data().count / numPerPages);
    console.log("[UserSearch][NumPages] result", {
      count: count.data().count,
      numPages,
    });
    return numPages;
  } catch (error) {
    console.error("[UserSearch][NumPages] error", {
      adminRole,
      adminEmail,
      searchField,
      numPerPages,
      filters,
      error,
    });
    throw error;
  }
};

export { saveUser, getUserById, updateUser, checkEmailExists };
