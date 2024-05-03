import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AutoPlaySlaider from "../AutoPlaySlaider/Slaider";
import CastingMovie from "../../services/CastingMovies/CastingMovie";
import Image from "next/image";
import './casting.css'
import { useState, useEffect } from "react";

export default function Casting({ idMovie }) {
  const [casting, setCasting] = useState({});
  useEffect(() => {
    const fetchCastingMovie = async () => {
      const result = await CastingMovie(idMovie);
      setCasting(result);
    };

    fetchCastingMovie();
  }, [idMovie]);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    speed: 1000,
    autoplaySpeed: 2000,
    cssEase: "ease-in-out",
  };

  return (
    <div className="slider_container">
      <h2 className="title__casting">Cast</h2>
      <Slider {...settings}>
        {casting.cast?.map((actor) => (
          <div className="card" key={actor.id}>
            <div className="img__casting">
              <Image
                className="img"
                src={`https://image.tmdb.org/t/p/original${actor.profile_path}`}
                alt={actor.name}
                width={180}
                height={250}
              ></Image>
            </div>
            <div className="name__casting">
              <span className="name__actor">{actor.name}</span>
              <span className="chararter__name">{actor.character}</span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
