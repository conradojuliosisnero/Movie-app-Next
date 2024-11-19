"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./welcome.module.css";
import Image from "next/image";
import errorImage from "../../../public/image-no-found.svg";
import BackgroundVideo from "../BackgroundVideo/BackgroundVideo";

export default function Welcome({ dataMovieHome }) {
  const [videoView, setVideoView] = useState(false);
  const [windowWidth, setWindowWidth] = useState(undefined);

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    updateWindowWidth();

    if (windowWidth >= 768) {
      setTimeout(() => {
        setVideoView(true);
      }, 5000);
    } else {
      setVideoView(false);
    }

    window.addEventListener("resize", updateWindowWidth);

    return () => window.removeEventListener("resize", updateWindowWidth);
  }, [windowWidth]);

  const MOVIEHOME = dataMovieHome.slice(0, 1)[0] || null;
  const router = useRouter();

  const handlerVideoView = () => {
    router.push(`/movie-details/${MOVIEHOME.id}`);
  };

  return (
    <section className={styles.sectionMovie}>
      <div className={styles.container}>
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
                  width={1280}
                  height={720}
                  priority={true}
                  quality={30}
                />
              </motion.div>
            )}
            {videoView && (
              <BackgroundVideo
                id={MOVIEHOME?.id}
                videoView={videoView}
                setVideoView={setVideoView}
              />
            )}
          </AnimatePresence>
        </div>
        <div className={styles.overview}>
          <div className={styles.titleMovie}>
            <div className={styles.text}>
              <AnimatePresence>
                <motion.span
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={handlerVideoView}
                >
                  {MOVIEHOME ? MOVIEHOME.title : ""}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
