"use client";
import dynamic from "next/dynamic";
import styles from "./filters.modules.css";
import { useState } from "react";

const AsideFilter = () => {
  const [genero, setGenero] = useState("");
  const [anio, setAnio] = useState("");
  const [calificacion, setCalificacion] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para aplicar los filtros
    console.log("Filtros aplicados:", { genero, anio, calificacion });
  };

  return (
    <aside className={styles.filtrosAside}>
      <button
        className={styles.toggleFiltros}
        onClick={() => setMostrarFiltros(!mostrarFiltros)}
      >
        {mostrarFiltros ? "Ocultar Filtros" : "Mostrar Filtros"}
      </button>
      <div
        className={`${styles.filtrosContenido} ${
          mostrarFiltros ? styles.mostrar : ""
        }`}
      >
        <h2 className={styles.titulo}>Filtros de Películas</h2>
        <form onSubmit={handleSubmit} className={styles.formulario}>
          <div className={styles.filtroGrupo}>
            <label htmlFor="genero" className={styles.label}>
              Género:
            </label>
            <select
              id="genero"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              className={styles.select}
            >
              <option value="">Todos los géneros</option>
              <option value="accion">Acción</option>
              <option value="comedia">Comedia</option>
              <option value="drama">Drama</option>
              <option value="ciencia-ficcion">Ciencia Ficción</option>
            </select>
          </div>

          <div className={styles.filtroGrupo}>
            <label htmlFor="anio" className={styles.label}>
              Año de lanzamiento:
            </label>
            <select
              id="anio"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              className={styles.select}
            >
              <option value="">Todos los años</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="anterior">Anterior a 2020</option>
            </select>
          </div>

          <div className={styles.filtroGrupo}>
            <label htmlFor="calificacion" className={styles.label}>
              Calificación mínima:
            </label>
            <select
              id="calificacion"
              value={calificacion}
              onChange={(e) => setCalificacion(e.target.value)}
              className={styles.select}
            >
              <option value="">Todas las calificaciones</option>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas o más</option>
              <option value="3">3 estrellas o más</option>
              <option value="2">2 estrellas o más</option>
              <option value="1">1 estrella o más</option>
            </select>
          </div>

          <button type="submit" className={styles.botonAplicar}>
            Aplicar Filtros
          </button>
        </form>
      </div>
    </aside>
  );
};

export default dynamic(() => Promise.resolve(AsideFilter));
