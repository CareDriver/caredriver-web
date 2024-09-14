import admin from "firebase-admin";
import { NextResponse } from "next/server";

const FIREBASE_PROJECT_ID = "caredriver-61ac3";
const FIREBASE_STORAGE_BUCKET = "caredriver-61ac3.appspot.com";
const FIREBASE_PRIVATE_KEY =
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0u3ngg/24u265\nBaqxLwbsKLZW4LnQwxYsD3Ua1TY0Zb+zp8Hso1NQV/FLO+sto2Ey4ex7HRn5Yzj/\nGdk7XNIt9Uc9RmHd1Uv3Is0vAZ4oHvWoBw3MsnBWf5byocpLZ74STlfp9Pob5LDP\n3IMah6b/dYBO+eK1iLlN2QkPq61lw58eJ5+xiA6LPuuvbaTxe1BP+J8rHKB7vz9t\nl7ErTMsazMLop33nBn8OdrlZQGn5qpyHDYDKEY63WEVz4iT6xkRqRXU2SRQqENtD\nFDyLRCR4QAWA831cqGeZOkLzDbzvg6VJUDG+42W9jlUQl5pBthEgFhbSsWUt05kv\nglZTy/8PAgMBAAECggEAAd+1vkmwDkPHPJzd7bNen4E2jsUKuCrlpnRMkwgl5Tou\n2CaDoLf6y6j1xAFtiU4Z2mS0RnyBQfAw7Zgvg+mM9lQGNpDtv9aP0JKoTPX31VOo\n2WKlVnt9JbBx+LcLuWdsdZUhXTgghbyDxsvzAgnpBdoKiAcYPiiaPz/iU6rEg/sU\nS3ryrszBgh9cjzXsq2NcsP27oWrno8KA+jj3YxfpbZa7oBv0N0GKWYvnHvkocugg\n4t/MjhZMC20dMhbTsroZ/zUK4Tz2BOfIyFwCIHls2uJ0sDqmBycXuZ6Iip90CI+i\nfrqItKyeYKwyK67UoHbV2ksdnTlI74MfWUNL5G2WvQKBgQDc+OcPhaPdga2JjI/V\nxGo2HiOctwz/sR1WN9LwE8OlLgTe91oqtMkii+8mwu2WfBzQtYbRTNKX/XGscGbI\n0fpoSbOo/BlPLhjvWvHNE/XXxub/e3xGsz6I9OwUNSJ3r70ZPwOli1N+B1WX+BCv\nM7uGZrtILQWlx9nEUBtz/q20gwKBgQDRYaDy+W4nSan95OXEIfDcRmSxZVrEhUHA\nP2WVjhk++nixVFtUn8bVmfsryCMyaAzWjgS79v28n3f58xW34IlHkoVVEb8GZnlD\nckqQcCDHBN5dW2zxyrXUlAIE3TDo8MiZFui7+EpgKUpRA84x9eGOoaGrq4xq5Rs5\n4lx3EC49hQKBgQCvAyvuLUhlrcmGQZ/CDTiZ+DD4dDqFYP/9Q2V75At2jgYpmfr+\nDAWpqO8W4hhOsaoY200WBCRfYMphavzdXQFZC9aRpmldPwNcv8j3RjHWXqCiBGmf\njWOgEWvRbWwJI1U/45q9yKWuEZ0HKd/9A5oojsESHyZz8N9XDqNPsYxehQKBgHQC\n/AKkYXwzPJUItqYtiB8EgdYoqloo232Bou9yhFp4vVbDvrbssGa5oolnotjS/goD\nNmxPNdfFI9zB606ugmG9tVKlOop5TMcqFFZjSkX7VJm1hm+SOZ1HRLcdN3RZtUvd\nfaZotA0D08F/skfMTOWSeNl9e5feyW8RFNqDhJthAoGAfZnbEqJ45wD41IS4bS1z\nt5BNBJpGsI5H7AxiLEySkrIlzQBb1ZcYGuZPVUIBnb9JrEkD/lTf7VSczSEl7nCj\nfjsnhlv8cI9GoBzSeGquyZrgdvvGe1bhqoqst3ufX8H7RTAY1cqsbsT0B5zn8kDf\nCONIOytFv5NGv/UPETJScTM=\n-----END PRIVATE KEY-----\n";
const FIREBASE_CLIENT_EMAIL =
    "firebase-adminsdk-2nh9w@caredriver-61ac3.iam.gserviceaccount.com";

const formatPrivateKey = (key) => {
    return key.replace(/\\n/g, "\n");
};

const createFirebaseAdminApp = (params) => {
    const privateKey = formatPrivateKey(params.privateKey);
    if (admin.apps.length > 0) {
        return admin.app();
    }

    const cert = admin.credential.cert({
        projectId: params.projectId,
        clientEmail: params.clientEmail,
        privateKey,
    });

    return admin.initializeApp({
        credential: cert,
        projectId: params.projectId,
        storageBucket: params.storageBucket,
    });
};

const initAdmin = async () => {
    const params = {
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        storageBucket: FIREBASE_STORAGE_BUCKET,
        privateKey: FIREBASE_PRIVATE_KEY,
    };

    return createFirebaseAdminApp(params);
};

export async function POST(request) {
    try {
        await initAdmin();
        const { userId, state } = await request.json();
        await admin.auth().updateUser(userId, {
            disabled: state,
        });

        return NextResponse.json({ userId });
    } catch (e) {
        return NextResponse.json({ error: "error, inténtalo de nuevo por favor" });
    }
}
