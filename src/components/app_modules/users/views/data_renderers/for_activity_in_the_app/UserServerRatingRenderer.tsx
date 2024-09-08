import StarRating from "@/components/modules/StarRating";
import { ServicesDataInterface } from "@/interfaces/ServicesDataInterface";

const UserServerRatingRenderer = ({
    serviceData,
}: {
    serviceData: ServicesDataInterface | undefined;
}) => {
    console.log(serviceData);

    return (
        serviceData && (
            <div className="margin-top-15">
                <StarRating rating={serviceData.averageRating} />
                <div className="text">
                    <b className="text | bold">
                        Cantidad de servicios realizados:{" "}
                    </b>{" "}
                    {serviceData.servicesQuantity}
                </div>
                <div className="separator-horizontal"></div>
            </div>
        )
    );
};

export default UserServerRatingRenderer;
