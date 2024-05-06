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
    speed: 2000,
    autoplaySpeed: 1000,
    cssEase: "ease-in-out",
  };

  console.log();
  return (
    <div className="slider-container">
      <span className={styles.popularyTitle}>Populary</span>
      <Slider {...settings}>
        {dataMovies?.slice(0, 15).map((movie, index) => (
          <div key={movie.id} className={styles.contendCarrussel}>
            <div className={styles.poster}>
              {/* number  */}
              <div className={styles.boxNumberMovie}>
                <span className={styles.numberMovie} key={movie.id}>
                  {index + 1}
                </span>
              </div>
              <Image
                className={styles.posterImg}
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={dataMovies.title}
                width={350}
                height={250}
                loading="lazy"
                layout="responsive"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default AutoPlaySlaider;
