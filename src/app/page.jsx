"use client";
import { useState, useEffect } from "react";
import Login from "@/components/Login/Login";
import Carrusel from "@/components/Carrusel/Carrusel";
import homeStyles from '@/styles/home.module.css'

export default function HomePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/home");
      const data = await response.json();
      setData(data);
    }
    fetchData();
  }, []);

  return (
    <>
      <div className={homeStyles.carruselContainer}>
        <Carrusel dataMovies={data}/>
      </div>
      <div className="login-container">
        <Login />
      </div>
    </>
  );
}
