import "./search.css";
import FilterNav from "../Filter/FilterNav";
import Image from "next/image";
import SearchIcon from "../../../public/search.svg";
import closeSearch from '../../../public/close-search.svg'

export default function Search({ funtion, value, filter, close }) {
  
  return (
    <div className="search">
      <input
        type="text"
        className="search__input"
        placeholder="Buscar"
        value={value}
        onChange={funtion}
      />
      {/* boton de busqueda */}
      <div className="search__button">
        {value == "" ? (
          <Image src={SearchIcon} width={21} height={21} alt={"search-icon"} />
        ) : (
          <Image
            src={closeSearch}
            width={21}
            height={21}
            alt={"close-search-icon"}
            onClick={close}
          />
        )}
      </div>
      {/* filtro */}
      <div className="filter__container">
        <FilterNav funtion={filter} />
      </div>
    </div>
  );
}
