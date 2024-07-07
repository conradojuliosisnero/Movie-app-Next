"use client";
import styles from "./modal.module.css";
import { useState, useEffect } from "react";
import GetVideosMovies from "../../services/MovieVideos/MovieVideos";
import GetVideoSeries from "../../services/serieVideos/videoSerie";
import { useParams } from "next/navigation";

export default function ModalVideo({ id }) {
  const [popUp, setPopUp] = useState(false);
  const [keyVideoMovie, setKeyVideoMovie] = useState({});
  const [windowWidth, setWindowWidth] = useState(undefined);
  const [videoSerie, setKeyVideoSerie] = useState({});
  const [result, setResult] = useState({});

  const pathname = useParams();

  useEffect(() => {
    const getVideos = async () => {
      let result = [];
      if (pathname.idserie == id) {
        const data = await GetVideoSeries(id, setKeyVideoSerie);
        result = data;
        setKeyVideoMovie(result);
      } else {
        const response = await GetVideosMovies(id, setKeyVideoMovie);
        result = response;
        setKeyVideoSerie(result);
      }
      setResult(result);
    };

    // resize del modal de video
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    getVideos();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [id]);

  const handlerPopUp = () => {
    setPopUp(true);
  };

  const closePopUp = () => {
    setPopUp(false);
  };

  if (keyVideoMovie == null && pathname.id == id) {
    return (
      <div className={styles.trailer_not_found}>trailer no disponible</div>
    );
  }

  if (videoSerie == null && pathname.idserie == id) {
    return (
      <div className={styles.trailer_not_found}>trailer no disponible</div>
    );
  }

  return (
    <div className={styles.BoxModal}>
      <button className={styles.ButtonPopUp} onClick={handlerPopUp}>
        Ver Trailer
      </button>
      {popUp && (
        <div className={styles.Modal}>
          <div className={styles.ModalVideo}>
            <iframe
              className="modal__responsive"
              width={windowWidth}
              height={windowWidth == "350" ? "350" : "500"}
              src={`https://www.youtube.com/embed/${
                keyVideoMovie || videoSerie
              }?si=PHP-j5Bd74KhaLF-`}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
            {/* button close  */}
            <button className={styles.ClosePopUp} onClick={closePopUp}>
              volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
