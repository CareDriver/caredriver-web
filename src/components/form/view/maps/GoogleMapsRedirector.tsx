import LocationDot from "@/icons/LocationDot";

const GoogleMapsRedirector = ({
    googleMapsUrl,
}: {
    googleMapsUrl: string | undefined | null;
}) => {
    return (
        googleMapsUrl && (
            <button
                className="map-button-redirector small-general-button purple | icon-wrapper white-icon | margin-top-15"
                onClick={() => window.open(googleMapsUrl, "_blank")}
                type="button"
            >
                <LocationDot />
                <span className="text | bold white">Ver en Google Maps</span>
            </button>
        )
    );
};

export default GoogleMapsRedirector;
