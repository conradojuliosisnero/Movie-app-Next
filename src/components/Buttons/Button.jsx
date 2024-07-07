import "./button.scss";
import { useState, useEffect } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { motion,AnimatePresence } from "framer-motion";

export default function Button({ funtionPage, isNext }) {
  const [showButton, setShowButton] = useState(true); // Inicialmente mostramos el botón

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setShowButton(false);
      } else {
        setShowButton(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //variants animations
  const variants = {
    hidden: { opacity: 0},
    visible: { opacity: 1},
    exit: { opacity: 0},
  };

  return (
    <AnimatePresence>
      {!showButton && (
        <motion.div className="contend__buttons"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.4 }}
        >
          <div className={`button ${isNext ? "ButtonNext" : "ButtonPrev"}`}>
            {isNext ? (
              <button className="icon__button" onClick={funtionPage}>
                <GrNext />
              </button>
            ) : (
              <button className="icon__button" onClick={funtionPage}>
                <GrPrevious />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
