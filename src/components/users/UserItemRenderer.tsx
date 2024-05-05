import { UserInterface } from "@/interfaces/UserInterface";
import { DEFAULT_PHOTO, getRole } from "@/utils/user/UserData";
import Link from "next/link";

const UserItemRenderer = ({ req }: { req: UserInterface }) => {
    var role = getRole(req);

    return (
        <Link href={`/admin/users/${req.id}`} className={`users-item | touchable ${req.disable && "users-disable"}`}>
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
                <div className="row-wrapper">
                    {req.disable && <h4 className="text | bold yellow">Desabilitado</h4>}

                    <h4
                        className={`users-item-role text | right bold ${
                            role.isHigher && "green"
                        }`}
                    >
                        {role.value}
                    </h4>
                </div>
            </div>
        </Link>
    );
};

export default UserItemRenderer;
