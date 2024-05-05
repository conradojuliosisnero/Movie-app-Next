"use client";
import React from "react";
import Link from "next/link";
import "./nav.css";
import { optionMenu } from "./data";
import logoWebsite from "../../../public/logo-website.svg";
import Search from "../SearchInput/Search";
import Image from "next/image";

const Nav = () => {
  return (
    <header className="header">
      {/* nav  */}
      <nav className="nav">
        <div className="logo-website">
          <Image
            
            src={logoWebsite}
            width={50}
            height={50}
            priority={true}
            alt="logo-movie-website"
          ></Image>
        </div>
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
      <div className="search__contend">
        {/* <Search /> */}
      </div>
    </header>
  );
};

export default Nav;
