import { logout } from "@/firebase/servicesFirebase";
import { useRouter } from "next/navigation";

export default function SessionButton() {
  const router = useRouter();
  const handlerLogout = async () => {
    try {
      const response = await logout(); // Espera a que se complete el logout
      console.log(response);
      localStorage.removeItem("isLoggedIn");
      router.push("/");
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
