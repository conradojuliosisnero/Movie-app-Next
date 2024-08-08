import "./login.css";
import { GoogleSvg, EyeSvg, LockSvg, EmailSvg } from "@/assets/svg";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  singInWithEmailAndPassword,
  registerUserWithEmailAndPassword,
} from "@/lib/servicesFirebase";

export default function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [register, setRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [verifyEmail, setVerifyEmail] = useState(false);

  // regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handlerOnchange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const validateEmail = (email) => {
    if (user.email == "") {
      setVerifyEmail({ email: "please enter your email" });
    } else if (!emailRegex.test(email)) {
      setVerifyEmail(false);
    } else {
      setVerifyEmail(true);
    }
  };

  useEffect(() => {
    validateEmail(user.email);
  }, [user.email]);

  const validateEmailAndPassword = () => {
    if (user.email === "" && user.password === "") {
      setErrors(true);
    }
  };

  const email = user.email;
  const password = user.password;
  
const handleSubmit = async (event) => {
  event.preventDefault();

  const authenticate = async (email, password) => {
    try {
      const response = await (register
        ? registerUserWithEmailAndPassword(email, password)
        : singInWithEmailAndPassword(email, password));
      console.log(response);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };

  if (!register) {
    await authenticate(email, password);
  } else {
    await authenticate(email, password);
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
          />
        </div>
        {!verifyEmail ? (
          <p
            className="error"
            style={{ color: "red", margin: 0, fontSize: "12px" }}
          >
            {"is not a valid email"}
          </p>
        ) : null}

        <div className="flex-column">
          <label>Contraseña </label>
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
          <p style={{ color: "red", margin: 0, fontSize: "12px" }}>
            por favor rellene todos los campos
          </p>
        )}
        <div className="flex-row">
          {/* <div>
            <input type="checkbox" onClick={() => setRemeber(!remeber)} />
            <label>Remember me </label>
          </div> */}
          <span className="span">
            <Link href="/forgot-password">Olvide mi contraseña</Link>
          </span>
        </div>
        <button className="button-submit" onClick={validateEmailAndPassword}>
          {register ? "Registrar" : "Iniciar sesión"}
        </button>
        <p className="p">
          {register ? "Ya tienes una cuenta?" : "Aun no tienes una cuenta?"}
          <span className="span" onClick={() => setRegister(!register)}>
            {register ? "Inicia sesión" : "Registrarme"}
          </span>
        </p>
        <p className="p line">O inicia sesión con</p>

        <div className="flex-row">
          <button className="btn google">
            <GoogleSvg />
            Google
          </button>
        </div>
      </form>
    </div>
  );
}
