"use client";
import { useState, useEffect } from "react";
import styles from "./filter.module.css";
import ButtonFilter from "../FilterButton/ButtonFilter";
import filter from "../../../public/filter-2.svg";
import Image from "next/image";
import GetGender from "../../services/Genero/Gender";
import GetGenderFiltered from "../../services/FilterGender/FilterGender";

export default function FilterNav({ funtion }) {
  const [gender, setGender] = useState({});
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await GetGender(setGender);
    };

    fetchData();
  }, []);

  // mostrar o ocultar filtros
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
            {gender?.genres?.map(({ id, name }) => (
              <ButtonFilter
                keyword={name}
                key={id}
                id={id}
                funtionClick={funtion}
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
