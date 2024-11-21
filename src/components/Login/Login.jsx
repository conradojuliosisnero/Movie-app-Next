"use client";
import { GoogleSvg, EyeSvg, LockSvg, EmailSvg } from "@/assets/svg";
import { FIREBASE_ERRORS } from "@/firebase/firebaseErrors";
import { signInWithGoogle } from "@/firebase/servicesFirebase";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
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
        body: JSON.stringify(data),
      }
      const response = await fetch("/api/auth/login/login")
    } catch (error) {
      
    }
  });

  // const submitUserInfo = handleSubmit(async (data) => {
  //   try {
  //     const response = await (toggle
  //       ? singInWithEmailAndPassword(data.email, data.password)
  //       : registerUserWithEmailAndPassword(data.email, data.password));

  //     if (response) {
  //       toast(response, {
  //         icon: "🎬",
  //       });
  //     }
  //   } catch (error) {
  //     const errorMessage =
  //       FIREBASE_ERRORS[error.code] || FIREBASE_ERRORS["default"];
  //     toast.error(errorMessage);
  //   }
  // });

  // Login with Google
  const loginWithGoogle = async () => {
    toast.loading("Iniciando sesión con Google...");
    try {
      const response = await signInWithGoogle();
      if (response) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
      } else if (typeof response === "string") {
        toast.error("Error al iniciar sesión con Google");
        setIsLoggedIn(false);
      }
    } catch (error) {
      const errorMessage =
        FIREBASE_ERRORS[error.code] || FIREBASE_ERRORS["default"];
      toast.error(errorMessage);
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
          <button type="button" className="btn google" onClick={loginWithGoogle}>
            <GoogleSvg />
            Google
          </button>
        </div>
      </form>
    </div>
  );
}
