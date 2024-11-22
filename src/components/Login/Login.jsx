"use client";
import { GoogleSvg, EyeSvg, LockSvg, EmailSvg } from "@/assets/svg";
import { signInWithGoogle } from "@/firebase/servicesFirebase";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

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
      const OPTIONS = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      };
      const response = await fetch("/api/auth/login", OPTIONS);
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error);
      } else {
        toast.success("Inicio de sesión exitoso");
        router.push("/home");
      }
    } catch (error) {
      toast.error("Error al iniciar sesión");
    }
  });

  // Login with Google
  const loginWithGoogle = async () => {
    toast.loading("Iniciando sesión con Google...");
    try {
      const response = await signInWithGoogle();
      if (response) {
        const token = await response.user.getIdToken();
        const res = await fetch("/api/login/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          toast.success("Inicio de sesión con Google exitoso");
          router.push("/home");
        } else {
          const errorData = await res.json();
          toast.error(errorData.error);
        }
      } else if (typeof response === "string") {
        toast.error("Error al iniciar sesión con Google");
      }
    } catch (error) {
      toast.error("Error al iniciar sesión con Google");
    } finally {
      toast.dismiss();
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
