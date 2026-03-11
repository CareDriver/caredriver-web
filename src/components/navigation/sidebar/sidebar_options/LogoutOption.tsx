import LogOutIcon from "@/icons/LogOutIcon";

const LogoutOption = ({ logout }: { logout: () => void }) => {
  return (
    <div>
      <button onClick={logout} className={`sidebar-option`}>
        <LogOutIcon />
        <span>Salir</span>
      </button>
      <p
        style={{
          textAlign: "center",
          marginTop: 24,
          padding: "16px",
          color: "#aaa",
        }}
      >
        © 2025 DriverCare Innovations SRL
      </p>
    </div>
  );
};

export default LogoutOption;
