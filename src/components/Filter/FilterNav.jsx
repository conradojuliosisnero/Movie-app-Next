"use client";
import { useState, useEffect } from "react";
import styles from "./filter.module.css";
import ButtonFilter from "../FilterButton/ButtonFilter";
import filter from "../../../public/filter-2.svg";
import Image from "next/image";
import GetGender from "../../services/FilterMovie/GeneroMovie/Gender";
import GetGenderSerie from "../../services/FilterSerie/GenderSerie/GenderSerie";
import closeFilter from "../../../public/close-search.svg";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function FilterNav({ funtion }) {
  const [gender, setGender] = useState({});
  const [showFilter, setShowFilter] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      if (pathname === "/movies") {
        try {
          const response = await fetch("/api/movies/gender");
          const data = await response.json();
          setGender(data);
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const response = await fetch("/api/series/gender");
          const data = await response.json();
          setGender(data);
        } catch (error) {
          console.error(
            "ups algo salio mal al obtener los generos de las series"
          );
        }
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

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: {
        delay: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: 20,
      opacity: 0,
    },
  };

  const imagesVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5,
      },
      exit: {
        opacity: 0,
        scale: 0,
      },
    },
  };

  return (
    <div className={styles.BoxFilter}>
      {/* ICONS FILTER  */}
      <AnimatePresence>
        <motion.div
          className={styles.tagFilter}
          initial="hidden"
          animate="visible"
          variants={imagesVariants}
          transition={{ duration: 0.3 }}
        >
          {!showFilter ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={item}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={filter}
                alt="filter-icon"
                width={30}
                height={30}
                onClick={handlerFilter}
              />
            </motion.div>
          ) : (
            <Image
              src={closeFilter}
              alt="filter-icon"
              width={30}
              height={30}
              onClick={handlerFilter}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* FILTERS KEYWORDS  */}
      <AnimatePresence>
        <div className={styles.keyWordsContainer}>
          {showFilter && (
            <motion.div
              className={styles.keyWords}
              initial="hidden"
              animate="visible"
              variants={container}
            >
              {gender?.genres?.map(({ id, name }) => (
                <motion.div variants={item}>
                  <ButtonFilter
                    filterDis={handlerDisFilter}
                    keyword={name}
                    key={id}
                    id={id}
                    funtionClick={funtion}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}
