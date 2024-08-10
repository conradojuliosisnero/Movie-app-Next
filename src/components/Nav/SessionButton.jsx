// "use client";
import { logout } from "@/firebase/servicesFirebase";
import Link from "next/link";

export default function SessionButton() {
  const handlerLogout = async () => {
    try {
      await logout();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Link href={"/"} className="button-logout" onClick={handlerLogout}>
      Cerrar Sesion
    </Link>
  );
}
