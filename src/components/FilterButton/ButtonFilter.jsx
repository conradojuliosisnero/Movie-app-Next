import React from 'react'
import './filter.css'

export default function ButtonFilter({ keyword , onClick}) {
  return (
    <div className="buttonKeyword" onClick={() => onClick(keyword)}>
      {keyword}
    </div>
  );
}
