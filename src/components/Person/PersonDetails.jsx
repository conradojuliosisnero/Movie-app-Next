"use client";
import styles from "../DetailsCard/movidedesatils.module.css";
import "../../app/globals.css";
import Image from "next/image";
import Image404 from "../../../public/image-no-found.svg";
import ButtonShare from "@/components/Share/ButtonShare";
import { useState, useEffect } from "react";
import HeartSvg from "../UI/HeartSvg/Heart";

export default function PersonDetails({ id }) {
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPersonDetails = async () => {
      setIsLoading(true);
      const OPTIONS = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
      }
      try {
        const response = await fetch(`/api/person/${id}`, OPTIONS);
        const data = await response.json();
        setDetails(data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getPersonDetails();
  }, [id]);


  function detecGender(gender) {
    if (gender === 1) {
      return "Femenino";
    } else if (gender === 2) {
      return "Masculino";
    } else if (gender === 3) {
      return "No binario";
    } else {
      return "Desconocido";
    }
  }

  return (
    <section className={styles.sectionMovie}>
      {/* wrap movie  */}
      <div className={styles.container}>
        {/* background movie  */}
        <div className={styles.backgroundDetails}>
          <Image
            className={styles.backgroundDetailsImg}
            src={
              details?.profile_path
                ? `https://image.tmdb.org/t/p/original${details.profile_path}`
                : Image404
            }
            alt={details?.title ? details.title : details?.name}
            width={100}
            layout="responsive"
            height={100}
            decoding="async"
            priority={true}
            quality={30}
          />
        </div>
        {/* overview movie  */}
        <div className={styles.overview}>
          {/* name movie  */}
          <div className={styles.titleMovie}>
            <span>{details?.name}</span>
          </div>
          {/* details generes  */}
          <div className={styles.year_generes}>
            <div className={styles.genero}>
              Genero: {""}
              {detecGender(details?.gender)}
            </div>
            <div className={styles.genero}>
              Nacimiento: {""}
              {details?.place_of_birth}
            </div>
            {/* stars movie  */}
            <div className={styles.stats}>
              <div
                style={{
                  //   backgroundColor: `${colors(details.vote_average)}`,
                  display: "flex",
                  borderRadius: "0.5em",
                  padding: "10px 5px",
                  color: "white",
                }}
              >
                {/* STARS  */}
                {/* <StarRating rating={details.vote_average} /> */}
                <div style={{ marginLeft: "10px" }}></div>
                <div
                  className={styles.votes}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <HeartSvg width={25} height={25} /> - {details?.popularity} K
                </div>
              </div>
            </div>
          </div>
          <p>
            {details?.biography ? details?.biography : "No tenemos descripción"}
          </p>
        </div>
      </div>

      {/* SHARE BUTTON */}
      <div>
        <ButtonShare />
      </div>
    </section>
  );
}
