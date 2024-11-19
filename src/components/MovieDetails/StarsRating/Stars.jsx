"use client";
import { useState, useEffect } from "react";
import "./stars.css";
import dynamic from "next/dynamic";

const StarRating = ({ rating }) => {
  const [filledStars, setFilledStars] = useState(0);

  useEffect(() => {
    setFilledStars(Math.floor(rating));
  }, [rating]);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < filledStars ? "star filled" : "star"}></span>
      );
    }
    return stars;
  };

  return <div className="star-rating">{renderStars()}</div>;
};

export default dynamic(() => Promise.resolve(StarRating));
