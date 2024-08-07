import "./login.css";
import Image from "next/image";
import Link from "next/link";
import { GoogleSvg, EyeSvg, LockSvg, EmailSvg } from "@/assets/svg";

export default function Login() {
  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  return (
    <div className="containerForm">
      <form className="form" onSubmit={handleSubmit}>
        <div className="flex-column">
          <label>Email </label>
        </div>
        <div className="inputForm">
          <EmailSvg />
          <input type="text" className="input" placeholder="Enter your Email" />
        </div>

        <div className="flex-column">
          <label>Password </label>
        </div>
        <div className="inputForm">
          <LockSvg />
          <input
            type="password"
            className="input"
            placeholder="Enter your Password"
          />
          <EyeSvg />
        </div>

        <div className="flex-row">
          <div>
            <input type="checkbox" />
            <label>Remember me </label>
          </div>
          <span className="span">Forgot password?</span>
        </div>
        <button className="button-submit">Sign In</button>
        <p className="p">
          Don't have an account? <span className="span">Sign Up</span>
        </p>
        <p className="p line">Or With</p>

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
