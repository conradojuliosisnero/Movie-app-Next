"use client";
import { useState, useEffect } from "react";
import "./stars.css";

const StarRating = ({ rating }) => {
  const [filledStars, setFilledStars] = useState(0);

  useEffect(() => {
    setFilledStars(Math.floor(rating));
  }, [rating]);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <div key={i} className={i < filledStars ? "star filled" : "star"}></div>
      );
    }
    return stars;
  };

  return <div className="star-rating">{renderStars()}</div>;
};

export default StarRating;
