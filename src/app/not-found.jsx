"use client"
import notFound from "../../public/not-found-error.svg";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function notfound() {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  return (
    <div className={styles.page_404}>
      <Image src={notFound} alt="not-found" width={450} height={550} />
      <button onClick={goHome} className={styles.buttonHome}>
        Volver al Home
      </button>
    </div>
  );
}
