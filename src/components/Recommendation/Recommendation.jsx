import style from "./recommendation.module.css";
import GetRecommendation from "../../services/Recommendation/MovieRC";
import Image from "next/image";
import Slaider from "../AutoPlaySlaider/Slaider";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../AutoPlaySlaider/slaider.module.css";

const Recommendation = ({ detailsRC }) => {
  const [dataRC, setDataRC] = useState([]);
  useEffect(() => {
    GetRecommendation(detailsRC.id, setDataRC);
  }, []);

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
    <section className={style.RecommendationBox}>
      <div className={style.RecommendationTitle}>
        <span>Movie recommendation</span>
      </div>
      ;
      <div className={style.RecommendationSlaider}>
        <Slider {...settings}>
          {dataRC.results?.map((datarc) => (
            <div key={datarc.id} className={styles.contendCarrussel}>
              <div className={styles.poster}>
                <img
                  className={styles.posterImg}
                  src={`https://image.tmdb.org/t/p/w500/${datarc.poster_path}`}
                  alt={datarc.title}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Recommendation;
