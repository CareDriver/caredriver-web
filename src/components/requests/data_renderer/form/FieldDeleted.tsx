import TriangleExclamation from "@/icons/TriangleExclamation";

const FieldDeleted = ({ description }: { description: string }) => {
    return (
        <div className="icon-wrapper | lb">
            <TriangleExclamation />
            <p>{description}</p>
        </div>
    );
};

export default FieldDeleted;
