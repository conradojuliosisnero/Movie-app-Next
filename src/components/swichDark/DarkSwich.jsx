import React, { useState } from "react";
import "./swich.css";

export default function DarkSwich({ whitemode }) {
  // Asumiendo que quieres manejar el estado del tema dentro del componente
  const [isWhiteMode, setIsWhiteMode] = useState(false);

  const handleChange = (event) => {
    // Actualiza el estado local y llama a la función pasada como prop
    setIsWhiteMode(event.target.checked);
    whitemode(event.target.checked);
  };

  return (
    <div className="contend_swich">
      <label htmlFor="theme" className="theme">
        <span className="theme__toggle-wrap">
          <input
            id="theme"
            className="theme__toggle"
            type="checkbox"
            onChange={handleChange}
            role="switch"
            name="theme"
            checked={isWhiteMode} // Asegúrate de que el checkbox refleje el estado actual
          />
          {/* <span className="theme__fill"></span> */}
          <span className="theme__icon">
            <span className="theme__icon-part"></span>
            <span className="theme__icon-part"></span>
            <span className="theme__icon-part"></span>
            <span className="theme__icon-part"></span>
            <span className="theme__icon-part"></span>
            <span className="theme__icon-part"></span>
            <span className="theme__icon-part"></span>
            <span className="theme__icon-part"></span>
            <span className="theme__icon-part"></span>
          </span>
        </span>
      </label>
    </div>
  );
}
