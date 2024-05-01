import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./slaider.module.css";
import Image from "next/image";

function AutoPlaySlaider({ dataMovies }) {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    speed: 1000,
    autoplaySpeed: 2000,
    cssEase: "ease-in",
  };

  console.log();
  return (
    <div className="slider-container">
      <span className={styles.popularyTitle}>Populary</span>
      <Slider {...settings}>
        {dataMovies?.slice(0, 15).map((movie, index) => (
          <div key={movie.id} className={styles.contendCarrussel}>
            <div className={styles.poster}>
              <div className={styles.boxNumberMovie}>
                <span className={styles.numberMovie} key={movie.id}>{index + 1}</span>
              </div>
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
