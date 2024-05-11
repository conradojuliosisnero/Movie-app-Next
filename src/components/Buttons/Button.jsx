import "./button.scss";
import { useState, useEffect } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";

export default function Button({ funtionPage, isNext }) {
  const [showButton, setShowButton] = useState(true); // Inicialmente mostramos el botón

  useEffect(() => {
    let isScrolling;

    function handleScroll() {
      // Mostrar el botón
      setShowButton(true);

      // Limpiar el temporizador si existe
      clearTimeout(isScrolling);

      // Establecer un temporizador para ocultar el botón después de 1 segundo de inactividad de scroll
      isScrolling = setTimeout(() => {
        setShowButton(false);
      }, 1000); // Puedes ajustar el tiempo según tus necesidades
    }

    // Agregar event listener para detectar el scroll
    window.addEventListener("scroll", handleScroll);

    // Al desmontar el componente, remover el event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {!showButton ? (
        <div className="contend__buttons">
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
        </div>
      ) : (
        ""
      )}
    </>
  );
}
