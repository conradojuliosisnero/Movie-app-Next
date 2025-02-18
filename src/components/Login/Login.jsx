"use client";
import { GoogleSvg, EyeSvg, LockSvg, EmailSvg } from "@/assets/svg";
// import { FIREBASE_ERRORS } from "@/firebase/firebaseErrors";
import { signInWithGoogle } from "@/firebase/servicesFirebase";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState } from "react";
import "./login.css";
import { useRouter } from "next/navigation";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [toggle, setToggle] = useState(true);

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const objectEmail = {
    name: "email",
    placeholder: "Email",
    required: {
      value: true,
      message: "Por favor, ingrese su correo electrónico.",
    },
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "El correo electrónico no es válido.",
    },
  };

  const objectPassword = {
    name: "password",
    placeholder: "Contraseña",
    required: {
      value: true,
      message: "Por favor, ingrese su contraseña.",
    },
  };

  const submitUserInfo = handleSubmit(async (data) => {
    try {
      const URL = toggle ? "/api/auth/login" : "/api/auth/register";
      const OPTIONS = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      };
      console.log("URL:", URL);
      console.log("OPTIONS:", OPTIONS);
      const response = await fetch(
        URL,
        OPTIONS
      );
      if (response.ok) {
        const { message } = await response.json();
        toast.success(message);
        router.push("/home");
      } else {
        const { error } = await response.json();
        toast.error(error);
      }
    } catch (error) {
      toast.error("Error al iniciar sesión");
    }
  });

  // Login with Google
  const loginWithGoogle = async () => {
    const googleLogin = await signInWithGoogle();
    const token = await googleLogin.user.getIdToken();
    const email = await googleLogin.user.email;
    const name = await googleLogin.user.displayName;
    const photo = await googleLogin.user.photoURL;
    try {
      const OPTIONS = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          token: token,
          name: name,
          photo: photo,
        }),
      };
      const response = await fetch("/api/auth/google", OPTIONS);
      if (response.ok) {
        const { message } = await response.json();
        toast.success(message);
        router.push("/home");
      } else {
        const { error } = await response.json();
        toast.error(error);
      }
    } catch (error) {
      toast.error("Error al iniciar sesión con Google");
    }
  };

  return (
    <div className="containerForm">
      <form className="form" onSubmit={submitUserInfo}>
        {/* EMAIL  */}
        <div>
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
              {...register("email", objectEmail)}
            />
          </div>
          {errors.email && (
            <p style={{ color: "red" }}>{errors.email.message}</p>
          )}
        </div>

        {/* PASSWORD  */}
        <div>
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
              {...register("password", objectPassword)}
            />
            <EyeSvg
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        <button type="submit" className="button-submit">
          {toggle ? "Iniciar sesión" : "Registrarse"}
        </button>

        {/* <Toaster position="top-center" reverseOrder={false} /> */}
        {/* TOGGLE SWITCH  */}
        <p className="p">
          {toggle ? "Aún no tienes una cuenta?" : "Ya tienes una cuenta?"}
          <span className="span" onClick={() => setToggle(!toggle)}>
            {toggle ? "Regístrate" : "Iniciar sesión"}
          </span>
        </p>
        {/* SESSION BY GOOGLE  */}
        <p className="p line">O inicia sesión con</p>
        <div className="flex-row">
          <button
            type="button"
            className="btn google"
            onClick={loginWithGoogle}
          >
            <GoogleSvg />
            Google
          </button>
        </div>
      </form>
    </div>
  );
}
