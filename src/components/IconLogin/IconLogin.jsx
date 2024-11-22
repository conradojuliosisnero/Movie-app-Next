"use client";
import Image from "next/image";
import "./avatar.css";
import userIconSvg from "@/assets/user.svg";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AvatarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userImage, setUserImage] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Obtener el email de la cookie
    const email = Cookies.get("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = async () => {
    const OPTIONS = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    try {
      const res = await fetch("/api/auth/logout", OPTIONS);
      if (res.ok) {
        Cookies.remove("userEmail");
        Cookies.remove("firebaseToken");
        setUserEmail(null);
        router.push("/");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  function cutname(str) {
    if (!str) return "";
    return str.slice(0, 15);
  }

  return (
    <div className="avatar-container">
      <button className="avatar-button" onClick={() => setIsOpen(!isOpen)}>
        {userImage ? (
          <Image
            src={userImage || userIconSvg}
            alt={"user-icon"}
            width={100}
            height={100}
            priority={true}
            quality={30}
            className="avatar-image"
          />
        ) : (
          <div className="avatar-fallback">
            {userEmail?.charAt(0).toUpperCase()}
            {/* // userData?.email?.charAt(0).toUpperCase()} */}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="menu-header">Mi Cuenta</div>
          <div className="menu-item">
            <span className="user-icon">👤</span>
            <span onClick={() => router.push("/profile")}>
              {cutname(userEmail)}
            </span>
          </div>
          <button
            className="logout-button"
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
          >
            <span className="logout-icon">↪️</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
};

// export default function IconLogin() {
//   const { userData } = useContext(AuthContext);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // Función para mostrar la primera letra en mayúscula
//   const firstLetter = (str) => {
//     if (!str) return "";
//     return str.charAt(0).toUpperCase();
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen((prev) => !prev);
//   };

//   const handleLogout = async () => {
//     await logout();
//     setIsMenuOpen(false);
//   };

//   return (
//     <div className={icon.login}>
//       <div className={icon.iconContainer} onClick={toggleMenu}>
//         {userData?.photoURL ? (
//           <div className={icon.halo}>
//             <Image
//               src={userData.photoURL}
//               alt={userData.displayName || userData.email}
//               width={100}
//               height={100}
//               priority={true}
//               quality={30}
//               className={icon.logoName}
//             />
//           </div>
//         ) : (
//           <div className={icon.halo}>
//             <p className={icon.logoName}>
//               {firstLetter(userData?.displayName || userData?.email)}
//             </p>
//           </div>
//         )}
//       </div>
//       {isMenuOpen && (
//         <div className={icon.menu}>
//           <button className={icon.menuItem} onClick={handleLogout}>
//             Cerrar sesión
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
