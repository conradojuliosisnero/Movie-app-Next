"use client";
import Home from "@/components/Home/Home";
import { useState, useEffect } from "react";

export default function page() {
  const [data, setData] = useState([]);
  const [seriesData, setDataSeries] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/home");
      const data = await response.json();
      setData(data);
    }

    async function fetchDataSeries() {
      const response = await fetch("/api/series?page=1");
      const dataSeries = await response.json();
      setDataSeries(dataSeries);
    }

    fetchDataSeries();
    fetchData();
  }, []);

  return <Home data={data} dataSeries={seriesData} />;
}
