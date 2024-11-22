import "./container.css";

export default function Container() {
  return (
    <div className="container">
      {Array.from({ length: 10 }).map((index) => (
        <div className="pelicula" key={index}>
          <div className="contend__poster">
            <div className="imagen__esqueletor">
              <div className="name_movie"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
