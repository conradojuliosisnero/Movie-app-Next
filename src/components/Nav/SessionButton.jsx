// "use client";
import { logout } from "@/firebase/servicesFirebase";
import Link from "next/link";

export default function SessionButton() {
  const handlerLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <Link href={"/"} className="button-logout" onClick={handlerLogout}>
      Cerrar Sesion
    </Link>
  );
}
