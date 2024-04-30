import React from "react";
import Nav from "../components/Nav/Nav";
import "../app/globals.css";
import { Inter } from "next/font/google";
import Footer from "../components/footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function MovieLayout({ children }) {
  return (
    <section className={inter.className}>
      <Nav />
      {children}
      <Footer />
    </section>
  );
}
