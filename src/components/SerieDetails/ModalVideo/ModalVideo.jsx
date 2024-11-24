"use client";
import styles from "./modal.module.css";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ModalVideo({ id }) {
  const [popUp, setPopUp] = useState(false);
  const [keyVideoSerie, setKeyVideoSerie] = useState("");
  const [windowWidth, setWindowWidth] = useState(undefined);

  useEffect(() => {
    const getVideos = async () => {
      const OPTIONS = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        include: "credentials",
      };
      try {
        const response = await fetch(`/api/series/trailer?id=${id}`, OPTIONS);
        const data = await response.json();
        setKeyVideoSerie(data);
      } catch (error) {
        toast.error("Error al obtener el trailer de la Serie");
      }
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    // get videos
    if (id) {
      getVideos();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [id]);

  if (keyVideoSerie == null) {
    return (
      <div className={styles.trailer_not_found}>Trailer no disponible</div>
    );
  }

  return (
    <div className={styles.BoxModal}>
      <button className={styles.ButtonPopUp} onClick={() => setPopUp(!popUp)}>
        Ver Trailer
      </button>
      {popUp && (
        <div className={styles.Modal}>
          <div className={styles.ModalVideo}>
            <iframe
              className="modal__responsive"
              width={windowWidth}
              height={windowWidth == "350" ? "350" : "500"}
              src={`https://www.youtube.com/embed/${keyVideoSerie}?si=PHP-j5Bd74KhaLF-`}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
            {/* button close  */}
            <button
              className={styles.ClosePopUp}
              onClick={() => setPopUp(false)}
            >
              volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
