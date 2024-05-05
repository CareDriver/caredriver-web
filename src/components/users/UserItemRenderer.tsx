import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { DEFAULT_PHOTO } from "@/utils/user/UserData";
import Link from "next/link";

const UserItemRenderer = ({ req }: { req: UserInterface }) => {
    var role = {
        value: "Normal",
        isHigher: false,
    };
    if (req.role !== undefined && req.role !== UserRole.User) {
        role = {
            value: req.role,
            isHigher: true,
        };
    } else if (req.services.length > 1) {
        role = {
            value: "Normal | Servidor",
            isHigher: false,
        };
    }

    return (
        <Link href={`/admin/users/${req.id}`} className="users-item">
            <img
                src={req.photoUrl.url === "" ? DEFAULT_PHOTO : req.photoUrl.url}
                alt=""
                className="users-item-photo"
            />
            <div>
                <h2 className="text | bolder medium-big capitalize">{req.fullName}</h2>
                <h4 className="text | light">{req.email}</h4>
                <h4 className="text | light">{req.phoneNumber}</h4>
                <h4 className="text | light margin-bottom-50">
                    {req.services.toString().replaceAll(",", " | ")}
                </h4>
                <h4
                    className={`users-item-role text | right bold ${
                        role.isHigher && "green"
                    }`}
                >
                    {role.value}
                </h4>
            </div>
        </Link>
    );
};

export default UserItemRenderer;
