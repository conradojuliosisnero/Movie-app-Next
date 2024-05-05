import React from "react";
import "./filter.css";

export default function ButtonFilter({ keyword, funtionClick, id }) {
  const handleClick = () => {
    funtionClick(id,keyword);
  };

  return (
    <button className="buttonKeyword" onClick={handleClick}>
      {keyword}
    </button>
  );
}
