"use client";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";
import "./share.css";

export default function ButtonShare() {
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="share-container">
      {/* <div className="share-tittle">
        <span>Compartir en</span>
      </div> */}
      {/* FACEBOOK  */}
      <div className="share-contend-buttons">
        <FacebookShareButton
          url={url}
          quote="Mira esta página increíble, para ver películas!"
          hashtag="#moviesCon"
          className="share-button"
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        {/* TWITTER  */}
        <TwitterShareButton
          url={url}
          title="Mira esta página increíble, para ver películas!"
          hashtag="#moviesCon"
          className="share-button"
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        {/* WHATSAPP  */}
        <WhatsappShareButton
          url={url}
          title="Mira esta pelicula increíble! 🎬"
          className="share-button"
          separator=":"
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
    </div>
  );
}
