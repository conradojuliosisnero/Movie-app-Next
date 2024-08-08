import { LogOut } from "@/assets/svg";
import { logout } from "@/firebase/servicesFirebase";
import AuthContext from "@/context/AuthContext";
import { useContext } from "react";
import { useRouter } from "next/navigation";

export default function SessionButton() {
  const { setIsLoggedIn } = useContext(AuthContext);

  const router = useRouter();
  const handlerLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    router.push("/");
    logout();
  };

  return (
    <button className="button-logout" onClick={handlerLogout}>
      <LogOut width={45} height={45} />
    </button>
  );
}
