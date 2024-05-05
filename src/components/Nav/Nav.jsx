"use client";
import React from "react";
import Link from "next/link";
import "./nav.css";
import { optionMenu } from "./data";
import logoWebsite from "../../../public/logo-website.svg";
import Search from "../SearchInput/Search";
import Image from "next/image";
import MenuResponsive from "../../../public/menu-responsive.svg";
import { useState } from "react";

const Nav = () => {
  const [popUpMenu, setPopUpMenu] = useState(false);

  const handlerPopUp = () => {
    setPopUpMenu(!popUpMenu);
  };

  const handleCloseMenu = () => {
    setPopUpMenu(false);
  };

  return (
    <header className="header">
      {/* nav  */}
      <div className="logo-website">
        <Image
          src={logoWebsite}
          width={50}
          height={50}
          priority={true}
          alt="logo-movie-website"
        ></Image>
      </div>
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
