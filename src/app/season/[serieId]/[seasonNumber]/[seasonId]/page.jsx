"use client";
import React from "react";
import SeasonDetails from "../../../../../components/SeasonDetails/Details";
import { useParams } from "next/navigation";
import seasonDetails from "../../../../../services/SeasonDetail/SeasonDetails";
import { useState, useEffect } from "react";

export default function page() {
  const { serieId, seasonNumber } = useParams();

  const [season, setSeason] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSeason() {
      try {
        const data = seasonDetails(serieId, seasonNumber, setSeason);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    getSeason();
  }, [seasonNumber]);

  return <SeasonDetails loading={loading} details={season} />;
}
