"use client";
import { Inter } from "next/font/google";
import { MOVIEDETAILS } from "../data/data";
import { SERIEDETAILS } from "../data/data";
import Footer from "../components/footer/Footer";
import Head from "next/head";
import Nav from "@/components/NavDetails/Nav";
import "../app/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  weights: [300, 400, 600],
});

export default function MovieLayout({ children, type }) {
  const data = type === "movie" ? MOVIEDETAILS : SERIEDETAILS;

  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userLogged, setUserLogged] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    setUserLogged(isLoggedIn);

    if (isLoggedIn !== "true") {
      router.push("/");
    } else {
      setIsCheckingAuth(false); // Terminamos de chequear la autenticación
    }
  }, [router]);

  if (isCheckingAuth) {
    // Mientras se verifica la autenticación, no renderizamos nada o mostramos un spinner
    return null;
  }

  return (
    <div className={inter.className}>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
      </Head>
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
