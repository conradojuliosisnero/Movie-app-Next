"use client";
import styles from "./BackgroundVideo.module.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import GetVideosMovies from "../../services/MovieVideos/MovieVideos";
import { AnimatePresence, motion } from "framer-motion";
import ReactPlayer from "react-player/youtube";

const BackgroundVideo = ({ id, videoView, setVideoView }) => {
  // Definiendo estados
  const [keyVideoMovie, setKeyVideoMovie] = useState({});
  const [windowWidth, setWindowWidth] = useState(undefined);
  const [windowHeight, setWindowHeight] = useState(undefined);
  const [startVideo, setStartVideo] = useState(true);

  // Obteniendo el pathname
  const pathname = usePathname();

  // Obteniendo video del home
  useEffect(() => {
    // Verificar si el video ya ha sido mostrado anteriormente
    const videoShown = sessionStorage.getItem("videoShown");
    if (videoShown) {
      setStartVideo(false);
      return;
    }

    // Obtener video de la película despues de 5 segundos
    setTimeout(() => {
      const getVideos = async () => {
        let result = [];
        switch (pathname) {
          case "/":
            result = await GetVideosMovies(id, setKeyVideoMovie);
            break;
          default:
            break;
        }
      };
      getVideos();
      setVideoView(true);
    }, 5000);

    // resize del modal de video
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // altura de la ventana
    const handleResizeHeight = () => {
      setWindowHeight(window.innerHeight);
    };

    // Detectar scroll para pausar el video
    const handleScroll = () => {
      const initialScrollY = 0;
      const currentScrollY = window.scrollY;
      if (currentScrollY > initialScrollY) {
        setStartVideo(false);
      } else {
        setStartVideo(true);
      }
    };

    // ejecuta funciones
    handleResize();
    handleResizeHeight();
    handleScroll();

    // Eventos de resize y scroll
    window.addEventListener("resize", handleResize);
    window.addEventListener("resize", handleResizeHeight);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", handleResizeHeight);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [videoView]); //cada vez que cambie el videoView

  //variants animation
  const variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1.1,
      transition: { duration: 0.4 },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.4 } },
  };

  // Opciones del video
  const opts = {
    width: windowWidth,
    height: windowHeight,
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      modestbranding: 0,
      mute: 1,
    },
  };

  return (
    <div className={styles.videoContainer}>
      <AnimatePresence>
        {videoView && keyVideoMovie && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
          >
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${keyVideoMovie}`}
              controls={false}
              playing={startVideo}
              muted={true}
              width={opts.width}
              height={opts.height}
              onEnded={() => {
                setVideoView(false);
                sessionStorage.setItem("videoShown", "true");
              }}
            />
            <div className={styles.trasluced}></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BackgroundVideo;
