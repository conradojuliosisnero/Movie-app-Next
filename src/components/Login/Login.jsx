"use client";
import "./login.css";
import { GoogleSvg, EyeSvg, LockSvg, EmailSvg } from "@/assets/svg";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  singInWithEmailAndPassword,
  registerUserWithEmailAndPassword,
} from "@/firebase/servicesFirebase";
import { useRouter } from "next/navigation";
import { FIREBASE_ERRORS } from "@/firebase/firebaseErrors";

export default function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [register, setRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [verifyEmail, setVerifyEmail] = useState(null); // Inicializa como null

  // Regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handlerOnchange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const validateEmail = (email) => {
    if (email === "") {
      setVerifyEmail("Por favor, ingrese su correo electrónico.");
    } else if (!emailRegex.test(email)) {
      setVerifyEmail("El correo electrónico no es válido.");
    } else {
      setVerifyEmail(null); // No hay error
    }
  };

  useEffect(() => {
    if (user.email !== "") {
      validateEmail(user.email);
    }
  }, [user.email]);

  const validateEmailAndPassword = () => {
    if (user.email === "" || user.password === "") {
      setErrors("Por favor, rellene todos los campos.");
      return false;
    }
    if (verifyEmail) {
      setErrors(verifyEmail);
      return false;
    }
    return true;
  };

  const email = user.email;
  const password = user.password;

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateEmailAndPassword()) return;

    setLoading(true);
    setErrors(null);

    try {
      const response = await (register
        ? registerUserWithEmailAndPassword(email, password)
        : singInWithEmailAndPassword(email, password));

      if (response) {
        setErrors(response);
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.error(error);
      setErrors("Hubo un error al procesar su solicitud. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="containerForm">
      <form className="form" onSubmit={handleSubmit}>
        <div className="flex-column">
          <label>Correo </label>
        </div>
        <div className="inputForm">
          <EmailSvg />
          <input
            type="text"
            className="input"
            placeholder="Enter your Email"
            name="email"
            value={user.email}
            onChange={handlerOnchange}
            onBlur={() => validateEmail(user.email)} // Valida al salir del campo
          />
        </div>
        {verifyEmail && (
          <p
            className="error"
            style={{ color: "red", margin: 0, fontSize: "12px" }}
          >
            {verifyEmail}
          </p>
        )}

        <div className="flex-column">
          <label>Contraseña </label>
        </div>
        <div className="inputForm">
          <LockSvg />
          <input
            type={showPassword ? "text" : "password"}
            className="input"
            placeholder="Enter your Password"
            name="password"
            value={user.password}
            onChange={handlerOnchange}
          />
          <EyeSvg
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          />
        </div>
        {errors && (
          <p
            className="error"
            style={{ color: "red", margin: 0, fontSize: "12px" }}
          >
            {errors}
          </p>
        )}
        <div className="flex-row">
          {/* <span className="span">
            <Link href="/forgot-password">Olvidé mi contraseña</Link>
          </span> */}
        </div>

        <button className="button-submit" type="submit" disabled={loading}>
          {loading
            ? "Cargando..."
            : register
            ? "Registrarme"
            : "Iniciar sesión"}
        </button>
        <p className="p">
          {register ? "Ya tienes una cuenta?" : "Aún no tienes una cuenta?"}
          <span className="span" onClick={() => setRegister(!register)}>
            {register ? "Inicia sesión" : "Regístrate"}
          </span>
        </p>
        {/* <p className="p line">O inicia sesión con</p>

        <div className="flex-row">
          <button type="button" className="btn google">
            <GoogleSvg />
            Google
          </button>
        </div> */}
      </form>
    </div>
  );
}
