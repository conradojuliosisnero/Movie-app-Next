"use client";
import styles from "../DetailsCard/movidedesatils.module.css";
import Image from "next/image";
import errorImage from "../../../public/image-no-found.svg";
import { AnimatePresence, motion } from "framer-motion";
import BackgroundVideo from "../BackgroundVideo/BackgroundVideo";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Welcome({ dataMovieHome }) {
  // state video view
  const [videoView, setVideoView] = useState(false);
  const [windowWidth, setWindowWidth] = useState(undefined);

  useEffect(() => {
    // Función para actualizar el estado con el ancho actual de la ventana
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    // Actualizar el ancho al montar el componente
    updateWindowWidth();

    if (windowWidth >= 768) {
      setTimeout(() => { 
        setVideoView(true); 
      }, 5000);
    } else {
      setVideoView(false);
    }

    // Agregar listener para el evento resize
    window.addEventListener("resize", updateWindowWidth);

    // Limpiar el listener al desmontar el componente
    return () => window.removeEventListener("resize", updateWindowWidth);
  }, [windowWidth]); 

  // data movie home
  const MOVIEHOME = dataMovieHome && dataMovieHome.length > 0 ? dataMovieHome[0] : null;

  const router = useRouter();
  // handler video view
  const handlerVideoView = (event) => {
    router.push(`/movie/${MOVIEHOME.id}`);
  };

  return (
    <section className={styles.sectionMovie}>
      {/* wrap movie  */}
      <div className={styles.container}>
        {/* background movie  */}
        <div className={styles.backgroundDetails}>
          <AnimatePresence>
            {videoView == false && (
              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  className={styles.backgroundDetailsImg}
                  src={`https://image.tmdb.org/t/p/original${
                    MOVIEHOME ? MOVIEHOME.backdrop_path : errorImage
                  }`}
                  alt={MOVIEHOME ? MOVIEHOME.title : "image-welcome"}
                  width={100}
                  height={100}
                  quality={30}
                ></Image>
              </motion.div>
            )}
            {videoView && (
            <BackgroundVideo
              id={MOVIEHOME.id}
              videoView={videoView}
              setVideoView={setVideoView}
            />
            )}
          </AnimatePresence>
        </div>
        {/* overview movie  */}
        <div className={styles.overview}>
          {/* name movie  */}
          <div className={styles.titleMovie}>
            <AnimatePresence>
              {!videoView && (
                <motion.span
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 350 }}
                  transition={{ duration: 0.4 }}
                  onClick={handlerVideoView}
                >
                  {MOVIEHOME ? MOVIEHOME.title : ""}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
