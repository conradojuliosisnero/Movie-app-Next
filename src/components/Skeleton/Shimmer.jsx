// import styles from "./MovieDetails.module.css";
import shimmer from "./Shimmer.module.css";

const Shimmer = ({ width, height }) => {
  return (
    <div
      className={shimmer.shimmer}
      style={{
        width: width,
        height: height,
      }}
    />
  );
};

export default Shimmer;
