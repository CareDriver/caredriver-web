import { UserInterface } from "@/interfaces/UserInterface";
import Link from "next/link";

const UserItemRenderer = ({ req }: { req: UserInterface }) => {
    return (
        <Link href={`/admin/users/${req.id}`}>
            <img src={req.photoUrl.url} alt="" />
            <div>
                <h2>{req.fullName}</h2>
                <h4>{req.email}</h4>
                <h4>{req.phoneNumber}</h4>
                <h4>{req.services.toString().replaceAll(",", " | ")}</h4>
            </div>
        </Link>
    );
};

export default UserItemRenderer;
