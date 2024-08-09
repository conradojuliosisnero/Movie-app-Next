import { logout } from "@/firebase/servicesFirebase";

export default function SessionButton() {
  const handlerLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button className="button-logout" onClick={handlerLogout}>
      Cerrar Sesion
    </button>
  );
}
