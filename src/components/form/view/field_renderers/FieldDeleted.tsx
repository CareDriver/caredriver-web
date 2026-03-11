import TriangleExclamation from "@/icons/TriangleExclamation";

const FieldDeleted = ({ description }: { description: string }) => {
  return (
    <div className="icon-wrapper deleted-field | red-icon lb">
      <TriangleExclamation />
      <p className="text | red wrap">{description}</p>
    </div>
  );
};

export default FieldDeleted;
