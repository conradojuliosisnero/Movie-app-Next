import React from "react";
import "./filter.css";

export default function ButtonFilter({ keyword, funtionClick, id, filterDis }) {
  const handleClick = () => {
    funtionClick(id, keyword);
    filterDis()
  };

  return (
    <button className="buttonKeyword" onClick={handleClick}>
      {keyword}
    </button>
  );
}
