"use client";
import { useState, useEffect } from "react";
import styles from "./filter.module.css";
import ButtonFilter from "../FilterButton/ButtonFilter";
import filter from "../../../public/filter-2.svg";
import Image from "next/image";
import GetGender from "../../services/FilterMovie/GeneroMovie/Gender";
import GetGenderSerie from "../../services/FilterSerie/GenderSerie/GenderSerie";
import closeFilter from '../../../public/close-search.svg'
import { usePathname } from "next/navigation";

export default function FilterNav({ funtion }) {
  const [gender, setGender] = useState({});
  const [showFilter, setShowFilter] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      if (pathname === "/movies-series/movies-section") {
        const data = await GetGender(setGender);
      } else {
        const dataserie = await GetGenderSerie(setGender);
      }
    };

    fetchData();
  }, [pathname]);

  // mostrar o ocultar filtros
  const handlerFilter = () => {
    setShowFilter(!showFilter);
  };

  const handlerDisFilter = () => {
    setShowFilter(false);
  };

  return (
    <div className={styles.BoxFilter}>
      <div className={styles.tagFilter}>
        {!showFilter ? (
          <Image
            src={filter}
            alt="filter-icon"
            width={30}
            height={30}
            onClick={handlerFilter}
          />
        ) : (
          <Image
            src={closeFilter}
            alt="filter-icon"
            width={30}
            height={30}
            onClick={handlerFilter}
          />
        )}
      </div>
      <div className={styles.keyWordsContainer}>
        {showFilter ? (
          <div className={styles.keyWords}>
            {gender?.genres?.map(({ id, name }) => (
              <ButtonFilter
                filterDis={handlerDisFilter}
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
