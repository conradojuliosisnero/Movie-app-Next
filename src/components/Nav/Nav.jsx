// "use client";
import React from "react";
import Link from "next/link";
import styles from "./nav.module.css";
import Search from "../SearchInput/Search";
import { optionMenu } from "./data";
import Login from "../Login/Login";
import DarkSwich from "../swichDark/DarkSwich";
// import { useState } from "react";

export default function Nav() {
  // const [darkMode, setDarkMode] = useState(true);

  // if (!darkMode) {
  //   document.body.style.backgroundColor = "white";
  // } else {
  //   document.body.style.backgroundColor = "black";
  // }

  const handlerDarkMode = (e) => {
    setDarkMode(!darkMode);
  };
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.listNav}>
          {/* input seach */}
          {/* <Search /> */}
          {optionMenu.map(({ index, name, path }) => (
            <li className={styles.li} key={index}>
              <Link href={path}>{name}</Link>
            </li>
          ))}
          {/* <Login /> */}
          {/* <DarkSwich darkmode={handlerDarkMode} /> */}
        </ul>
      </nav>
      {/* swich  */}
    </header>
  );
}
