import { IoMdLogIn } from "react-icons/io";
import Link from "next/link";
import styles from "./login.module.css";

export default function Login() {
  return (
    <div className={styles.loginButton}>
      <Link href="/login">
          <IoMdLogIn />
      </Link>
    </div>
  );
}
