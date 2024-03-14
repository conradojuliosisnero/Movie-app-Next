import React from "react";
import Link from "next/link";
import styles from "./nav.module.css";
import Search from "../SearchInput/Search";
import { optionMenu } from "./data";
import Login from "../Login/Login";

export default function Nav() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.listNav}>
          {/* input seach */}
          <Search />
          {optionMenu.map(({ index, name, path }) => (
            <li className={styles.li} key={index}>
              <Link href={path}>{name}</Link>
            </li>
          ))}
          <Login />
        </ul>
      </nav>
    </header>
  );
}
