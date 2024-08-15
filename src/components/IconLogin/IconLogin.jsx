import Image from "next/image";
import icon from "./icon.module.css";
import { useContext, useState } from "react";
import AuthContext from "@/context/AuthContext";
import { logout } from "@/firebase/servicesFirebase";
import imgdefault from "../../../public/home.svg";

export default function IconLogin() {
  const { userData } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para mostrar la primera letra en mayúscula
  const firstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase();
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <div className={icon.login}>
      <div className={icon.iconContainer} onClick={toggleMenu}>
        {userData?.photoURL ? (
          <div className={icon.halo}>
            <Image
              src={userData.photoURL}
              alt={userData.displayName || userData.email}
              width={100}
              height={100}
              priority={true}
              quality={30}
              className={icon.logoName}
            />
          </div>
        ) : (
          <div className={icon.halo}>
            <p className={icon.logoName}>
              {firstLetter(userData?.displayName || userData?.email)}
            </p>
          </div>
        )}
      </div>
      {isMenuOpen && (
        <div className={icon.menu}>
          <button className={icon.menuItem} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
