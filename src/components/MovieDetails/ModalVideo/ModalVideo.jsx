"use client";
import dynamic from "next/dynamic";
import styles from "./modal.module.css";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import SkeletonLoading from "./SkeletonLoading";

const ModalVideo = ({ id }) => {
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(true);
  const [popUp, setPopUp] = useState(false);
  const [keyVideoMovie, setKeyVideoMovie] = useState({});
  const [windowWidth, setWindowWidth] = useState(undefined);

  useEffect(() => {
    const getVideos = async () => {
            const OPTIONS = {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              credentials: "include",
            };
      setLoading(true);
      try {
        const response = await fetch(`/api/movies/trailer?id=${id}`, OPTIONS);
        const data = await response.json();
        setKeyVideoMovie(data);
      } catch (error) {
        toast.error("Error al obtener el trailer de la pelicula");
      } finally {
        setLoading(false);
      }
    };
    setResult(result);

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

  if (loading) {
    return (
      <div className={styles.trailer_not_found}>
        <SkeletonLoading />
      </div>
    );
  }

  if (keyVideoMovie == null) {
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
              src={`https://www.youtube.com/embed/${keyVideoMovie}?si=PHP-j5Bd74KhaLF-`}
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
};

export default dynamic(() => Promise.resolve(ModalVideo), { ssr: false });
