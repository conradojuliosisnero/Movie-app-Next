import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./carrusel.module.css";
import Image from "next/image";
import imageNull from "../../../public/image-no-found.svg";

export default function Carrusel({ dataMovies }) {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 1000,
    cssEase: "linear",
  };

  return (
    <div className={styles.sliderContainer}>
      <Slider {...settings}>
        {dataMovies &&
          dataMovies.slice(0, 15).map((movie) => (
            <div key={movie.id} className={styles.contendCarrussel}>
              <div className={styles.poster}>
                <div className={styles.boxNumberMovie}></div>
                <Image
                  className={styles.posterImg}
                  src={`${
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                      : imageNull
                  } `}
                  alt={dataMovies.title || "image-movie"}
                  width={100}
                  height={100}
                />
              </div>
            </div>
          ))}
      </Slider>
    </div>
  );
}
