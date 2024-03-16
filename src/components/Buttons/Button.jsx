import "./button.scss";

export default function Button({ name, funtionPage }) {
  return (
    <button class="button" onClick={funtionPage}>
      <span>{name}</span>
    </button>
  );
}
