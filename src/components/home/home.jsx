import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./home.module.css";

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
      <div className={styles.title}></div>
      <Slider {...settings}>
        {dataMovies?.map((movie) => (
          <div key={movie.id} className={styles.contendCarrussel}>
            <div className={styles.poster}>
              <img
                className={styles.posterImg}
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={dataMovies.title}
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default AutoPlaySlaider;
