import React from "react";
import '../MediaCard/postercard.scss'

export default function Container() {
  const arrayNumeros = [];

  for (let i = 1; i <= 20; i++) {
    arrayNumeros.push(i);
  }

  return (
    <div className="contenedor">
      {arrayNumeros.map((numero, index) => (
        <div className="pelicula" key={index}>
          <div className="contend__poster">
            <div className="imagen__esqueletor"></div>
            <div className="contend__hover"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
