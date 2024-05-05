"use client";
import { useState } from "react";
import styles from "./filter.module.css";
import ButtonFilter from "../FilterButton/ButtonFilter";
import filter from "../../../public/filter-2.svg";
import Image from "next/image";
import Search from "../SearchInput/Search";

export default function FilterNav() {
  const [keyWord, setKeyWord] = useState("");
  const [showFilter, setShowFilter] = useState(false);
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

  const handlerFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className={styles.BoxFilter}>
      <span className={styles.tagFilter}>
        <Image
          src={filter}
          alt="filter-icon"
          width={30}
          height={30}
          onClick={handlerFilter}
        ></Image>
      </span>
      <div className={styles.keyWordsContainer}>
      {showFilter ? (
        <div className={styles.keyWords}>
          {filterKeyWords.map((keyWord) => (
            <ButtonFilter
              keyword={keyWord.name}
              key={keyWord.id}
              onClick={handleKeywordClick}
            ></ButtonFilter>
          ))}
        </div>
      ) : (
        <></>
      )}
      </div>
    </div>
  );
}
