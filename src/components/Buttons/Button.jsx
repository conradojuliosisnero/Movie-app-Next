import "./button.scss";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

export default function Button({ name, funtionPage }) {
  return (
    <button class="button" onClick={funtionPage}>
      <span>{name}</span>
    </button>
  );
}
