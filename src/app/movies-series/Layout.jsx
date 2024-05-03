import FilterNav from "../../components/Filter/FilterNav";

export default function LayoutMovieSection({ children }) {
  return (
    <main>
      <FilterNav></FilterNav>
      {children}
    </main>
  );
}
