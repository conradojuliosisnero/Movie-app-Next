"use client";
import { useState, useEffect } from "react";
import styles from "./filter.module.css";
import ButtonFilter from "../FilterButton/ButtonFilter";
import filter from "../../../public/filter.svg";
import Image from "next/image";

export default function FilterNav() {
    const [keyWord, setKeyWord] = useState("");
  const handleKeywordClick = (keyword) => {
      setKeyWord(keyword);
  };
  const filterKeyWords = [
    { id: 1, name: "accion" },
    { id: 2, name: "terror" },
    { id: 3, name: "comedia" },
    { id: 4, name: "drama" },
    { id: 5, name: "animacion" },
    { id: 6, name: "anime" },
  ];

  return (
    <div className={styles.BoxFilter}>
      <span className={styles.tagFilter}>
        <Image src={filter} alt="filter-icon" width={30} height={30}></Image>
      </span>
      {filterKeyWords.map((keyWord) => (
        <ButtonFilter
          keyword={keyWord.name}
          key={keyWord.id}
          onClick={handleKeywordClick}
        ></ButtonFilter>
      ))}
    </div>
  );
}
