"use client";
import { useState, useEffect } from "react";
import Home from "@/components/Home/Home";
import Login from "@/components/Login/Login";

export default function HomePage() {
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

  return <Login />;
}
