interface Props {
  marker: {
    isCheck: boolean;
    setCheck: (state: boolean) => void;
  };
  content: {
    checkDescription: React.ReactNode;
  };
}

const CheckField: React.FC<Props> = ({ marker, content }) => {
  return (
    <div
      onClick={() => marker.setCheck(!marker.isCheck)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #ccc",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "background 0.2s ease-in-out",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9f9")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <input
        type="checkbox"
        checked={marker.isCheck}
        onChange={() => {}}
        style={{
          width: "24px",
          height: "24px",
          accentColor: "#3b82f6", // azul bonito
          cursor: "pointer",
        }}
      />
      <div
        style={{
          fontSize: "18px",
          color: "#333",
        }}
      >
        {content.checkDescription}
      </div>
    </div>
  );
};

export default CheckField;
