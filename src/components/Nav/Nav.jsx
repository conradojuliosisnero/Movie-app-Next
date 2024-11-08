"use client";
import Link from "next/link";
import "./nav.css";
import { optionMenu } from "./data";
import logoWebsite from "../../../public/logo-website.svg";
import Image from "next/image";
import MenuResponsive from "../../../public/menu-responsive.svg";
import CloseMenu from "../../../public/close-white.svg";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import IconLogin, { AvatarMenu } from "../IconLogin/IconLogin";
import dynamic from "next/dynamic";

const Nav = () => {
  const [popUpMenu, setPopUpMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);

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
          {/* nav options  */}
          {optionMenu?.map(
            ({ id, name, path, icon, options }, index) => (
              (
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
              )
            )
          )}
          <div className="icon__login__user">
            {/* <IconLogin /> */}
            <AvatarMenu />
          </div>
        </ul>
      </nav>
      <div className={`listNavResponsive`}>
        <Image
          onClick={handlerPopUp}
          src={popUpMenu ? CloseMenu : MenuResponsive}
          alt="menu-responsive"
          width={40}
          height={40}
        ></Image>
      </div>
    </header>
  );
};

export default dynamic(() => Promise.resolve(Nav), { ssr: false });
