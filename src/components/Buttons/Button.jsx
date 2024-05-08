import "./button.scss";
import { useState,useEffect } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";

export default function Button({ funtionPage, isNext }) {
  return (
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
  );
}
