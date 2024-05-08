"use client";
import React from "react";
import Link from "next/link";
import "./nav.css";
import { optionMenu } from "./data";
import logoWebsite from "../../../public/logo-website.svg";
import Image from "next/image";
import MenuResponsive from "../../../public/menu-responsive.svg";
import { useState,useEffect } from "react";

const Nav = () => {
  const [popUpMenu, setPopUpMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const handlerPopUp = () => {
    setPopUpMenu(!popUpMenu);
  };

  const handleCloseMenu = () => {
    setPopUpMenu(false);
  };

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
  

  return (
    <header className={`header ${scrollY > 160 ? "scroll_nav" : ""}`}>
      {/* nav  */}
      <div className="logo-website">
        <Image
          className={`logo ${scrollY > 160 ? "logo__scroll":""}`}
          src={logoWebsite}
          width={40}
          height={40}
          priority={true}
          alt="logo-movie-website"
        ></Image>
      </div>
      {/* navegador  */}
      <nav className="nav">
        <ul className={`listNav ${popUpMenu ? "menu__active" : ""}`}>
          {/* nav options  */}
          {optionMenu?.map(({ id, name, path }) => (
            <li className="link-dark-mode" key={id}>
              <Link href={path} key={id} onClick={handleCloseMenu}>
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
