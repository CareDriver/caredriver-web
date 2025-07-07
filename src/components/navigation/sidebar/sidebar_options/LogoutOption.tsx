import LogOutIcon from "@/icons/LogOutIcon";

const LogoutOption = ({ logout }: { logout: () => void }) => {
  return (
    <button onClick={logout} className={`sidebar-option`}>
      <LogOutIcon />
      <span>Salir</span>
    </button>
  );
};

export default LogoutOption;
