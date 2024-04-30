import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./slaider.module.css";
import Image from "next/image";

function AutoPlaySlaider({ dataMovies }) {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2000,
    cssEase: "ease-in-out",
  };

  return (
    <div className="slider-container">
        <span className={styles.popularyTitle}>Populary</span>
      <Slider {...settings}>
        {dataMovies?.slice(0,15).map((movie) => (
          <div key={movie.id} className={styles.contendCarrussel}>
            <div className={styles.poster}>
              <Image
                className={styles.posterImg}
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={dataMovies.title}
                width={250}
                priority={true}
                height={350}
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default AutoPlaySlaider;
