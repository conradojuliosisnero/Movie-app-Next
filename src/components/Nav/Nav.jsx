"use client";
import React from "react";
import Link from "next/link";
import "./nav.css";
import { optionMenu } from "./data";
import { useState, useEffect } from "react";
import logoWebsite from "../../../public/logo-website.svg";
import Search from "../SearchInput/Search";
import Image from "next/image";

const Nav = () => {
  // const [darkmode, setDarkMode] = useState(false);

  // const handlerDarkMode = (e) => {
  //   setDarkMode(!darkmode);
  // };

  // useEffect(() => {
  //   if (darkmode) {
  //     document.body.classList.add("dark-mode-theme");
  //     const span = document.querySelectorAll("span");
  //     span.forEach((span) => (span.style.color = "#ffffff"));
  //   } else {
  //     document.body.classList.remove("dark-mode-theme");
  //     const span = document.querySelectorAll("span");
  //     span.forEach((span) => (span.style.color = ""));
  //   }
  // }, [darkmode]);

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
        <ul className="listNav">
          {/* nav options  */}
          {optionMenu?.map(({ id, name, path }) => (
            <li className="link-dark-mode" key={id}>
              <Link href={path} key={id}>
                {name}
              </Link>
            </li>
          ))}
          {/* swich darkmode */}
          {/* <DarkSwich whitemode={handlerDarkMode} /> */}
        </ul>
      </nav>
      {/* <Search /> */}
    </header>
  );
};

export default Nav;
