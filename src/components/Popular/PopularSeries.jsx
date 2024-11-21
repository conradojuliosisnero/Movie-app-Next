"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import imageNull from "../../../public/image-no-found.svg";
import styles from "./styles.module.css";

export default function PopularSeries({ dataSeries }) {
  const [settings, setSettings] = useState({
    dots: false,
    infinite: true,
    lazyLoad: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    speed: 300,
    cssEase: "ease",
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSettings({
          ...settings,
          slidesToShow: 2,
        });
      } else if (window.innerWidth <= 425) {
        setSettings({
          ...settings,
          slidesToShow: 1,
        });
      } else {
        setSettings({
          ...settings,
          slidesToShow: 3,
        });
      }
    };

    // Listener para cambiar las opciones del slider cuando cambia el tamaño de la pantalla
    window.addEventListener("resize", handleResize);

    // Limpia el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [settings]);

  return (
    <div className="slider-container">
      <span className={styles.popularyTitle}>Top Popular en Series</span>
      <Slider {...settings}>
        {dataSeries &&
          dataSeries.slice(0, 15).map((movie, index) => (
            <div key={movie.id} className={styles.contendCarrussel}>
              <div className={styles.poster}>
                <div className={styles.boxNumberMovie}>
                  <span className={styles.numberMovie} key={movie.id}>
                    {index + 1}
                  </span>
                </div>
                <Link href={`/serie-details/${movie.id}`}>
                  <Image
                    className={styles.posterImg}
                    src={`${
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                        : imageNull
                    } `}
                    alt={dataSeries.title || "image-movie"}
                    width={100}
                    height={100}
                  />
                </Link>
              </div>
            </div>
          ))}
      </Slider>
    </div>
  );
}
