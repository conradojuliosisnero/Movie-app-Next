"use client";
import SeasonDetails from "@/components/SeasonDetails/Details";
import seasonDetails from "@/services/SeasonDetail/SeasonDetails";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function page() {
  // states
  const [season, setSeason] = useState([]);
  const [loading, setLoading] = useState(true);

  // hooks
  const { serieId, seasonNumber } = useParams();

  // effects to get the season details
  useEffect(() => {
    async function getSeason() {
      try {
        const respose = await fetch(
          `/api/series/season?serieID=${serieId}&numberID=${seasonNumber}`
        );
        const data = await respose.json();
        setSeason(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    getSeason();
  }, [seasonNumber]);

  return <SeasonDetails loading={loading} details={season} />;
}
