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
        "Accept": "application/json",
      },
      credentials: "include",
    };
    try {
      const res = await fetch("/api/auth/logout", OPTIONS);
      if (res.ok) {
        // Eliminar cookies usando path y domain correctos
        Cookies.remove("userEmail", { path: "/" });
        Cookies.remove("firebaseToken", { path: "/" });
        
        setUserEmail(null);
        
        // Esperar un momento antes de redirigir
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirigir
        window.location.href = "/";
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
