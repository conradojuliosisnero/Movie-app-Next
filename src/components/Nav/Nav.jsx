"use client";
import Link from "next/link";
import "./nav.css";
import { optionMenu } from "./data";
import logoWebsite from "../../../public/logo-website.svg";
import Image from "next/image";
import MenuResponsive from "../../../public/menu-responsive.svg";
import { useState, useEffect,useContext } from "react";
import { useRouter } from "next/navigation";
import SessionButton from "./SessionButton";
import AuthProvider from "@/context/AuthContext";
import { useAuthUser } from "@/hooks/useAuthUser";

const Nav = () => {
  useAuthUser();
  const [popUpMenu, setPopUpMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const { isLoggedIn } = useContext(AuthProvider);
  console.log(isLoggedIn);

  const handlerPopUp = () => {
    setPopUpMenu(!popUpMenu);
  };

  const handleCloseMenu = () => {
    setPopUpMenu(false);
  };

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 154) {
        setScrollY(window.scrollY);
      }
    };

    // Agregar un event listener para el evento de scroll
    window.addEventListener("scroll", handleScroll);

    // Eliminar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const goHome = () => {
    router.push("/");
  };

  return (
    <header className={`header ${scrollY > 160 ? "scroll_nav" : ""}`}>
      {/* logo  */}
      <div className="logo-website">
        <Image
          className={`logo ${scrollY > 160 ? "logo__scroll" : ""}`}
          src={logoWebsite}
          width={40}
          height={40}
          priority={true}
          alt="logo-movie-website"
          onClick={goHome}
        />
      </div>
      {/* navegador  */}
      <nav className="nav">
        <ul className={`listNav ${popUpMenu ? "menu__active" : ""}`}>
          <SessionButton login={isLoggedIn} />
          {/* <div className="toogle_box">
            <Toogle />
          </div> */}
          {/* nav options  */}
          {optionMenu?.map(({ id, name, path, icon }) => (
            <li key={id} className={`link`}>
              <div className="icon__responsive">
                {popUpMenu ? (
                  <Image src={icon} width={30} height={30} alt="icon" />
                ) : (
                  ""
                )}
              </div>
              <Link
                className="link__icon"
                href={path}
                key={id}
                onClick={handleCloseMenu}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={`listNavResponsive`}>
        <Image
          onClick={handlerPopUp}
          src={MenuResponsive}
          alt="menu-responsive"
          width={40}
          height={40}
        ></Image>
      </div>
    </header>
  );
};

export default Nav;
