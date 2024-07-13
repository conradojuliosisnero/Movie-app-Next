import React from "react";
import './container.css'

export default function Container() {
  const arrayNumeros = [1];

  return (
    <div className="contenedor">
      {arrayNumeros.map((index) => (
        <div className="pelicula" key={index}>
          <div className="contend__poster">
            <div className="imagen__esqueletor"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
