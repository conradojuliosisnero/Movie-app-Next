"use client";
import { useState, useEffect } from "react";
import homeStyles from "@/styles/home.module.css";
import dynamic from "next/dynamic";

const Login = dynamic(() => import("@/components/Login/Login"));
const Carrusel = dynamic(() => import("@/components/Carrusel/Carrusel"));

export default function HomePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const OPTIONS = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      };
      const response = await fetch("/api/login", OPTIONS);
      const data = await response.json();
      setData(data);
    }
    fetchData();
  }, []);

  return (
    <>
      <div className={homeStyles.carruselContainer}>
        <Carrusel dataMovies={data} />
      </div>
      <div className="login-container">
        <Login />
      </div>
    </>
  );
}

