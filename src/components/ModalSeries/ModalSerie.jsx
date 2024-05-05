import React, { useEffect } from "react";
import styles from "./modal.module.css";
import { useState } from "react";
import GetVideoSeries from "../../services/serieVideos/videoSerie";

export default function ModalSerie({ id }) {
  const [popUp, setPopUp] = useState(false);
  const [keyVideoSerie, setKeyVideoSerie] = useState({});

  useEffect(() => {
    const getSeries = async () => {
      const response = await GetVideoSeries(setKeyVideoSerie,id);
    };
    getSeries();
  }, []);

  const handlerPopUp = () => {
    setPopUp(!false);
  };

  const closePopUp = () => {
    setPopUp(false);
  };

  return (
    <div className={styles.BoxModal}>
      <button className={styles.ButtonPopUp} onClick={handlerPopUp}>
        Ver Trailer
      </button>
      {popUp ? (
        <div className={styles.Modal}>
          <span className={styles.ModalVideo}>
            <iframe
              width="660"
              height="415"
              src={`https://www.youtube.com/embed/${keyVideoSerie}?si=PHP-j5Bd74KhaLF-`}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </span>
          <button className={styles.ClosePopUp} onClick={closePopUp}>
            Close
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
