import "./button.scss";
import { GrNext, GrPrevious } from "react-icons/gr";

export default function Button({ funtionPage, isNext }) {
  return (
    <div className={`button ${isNext ? "ButtonNext" : "ButtonPrev"}`}>
      {isNext ? (
        <button onClick={funtionPage}>
          <GrNext />
        </button>
      ) : (
        <button onClick={funtionPage}>
          <GrPrevious />
        </button>
      )}
    </div>
  );
}
