"use client"
import notFound from "../../public/not-found-error.svg";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Notfound() {
  const router = useRouter();

  const goHome = () => {
    router.push("/home");
  };

  return (
    <div className={styles.page_404}>
      <Image src={notFound} alt="not-found" width={350} height={350} />
      <Link href="/home" onClick={goHome} className={styles.buttonHome}>
        Volver al Home
      </Link>
    </div>
  );
}
