import { logout } from "@/firebase/servicesFirebase";
import { useRouter } from "next/navigation";

export default function SessionButton() {
  const router = useRouter();
  const handlerLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
    logout();
  };

  return (
    <button className="button-logout" onClick={handlerLogout}>
      Cerrar Sesion
    </button>
  );
}
