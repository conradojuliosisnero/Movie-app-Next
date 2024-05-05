"use client";
import { useState} from "react";
import "./search.css";
import FilterNav from "../Filter/FilterNav";
import Image from "next/image";
import SearchIcon from "../../../public/search.svg";

export default function Search({ funtion, value,filter }) {
  return (
    <div className="search">
      <input
        type="text"
        className="search__input"
        placeholder="Search Movie"
        value={value}
        onChange={funtion}
      />
      <button className="search__button" onChange={""}>
        <Image src={SearchIcon} width={21} height={21} alt={"search-icon"} />
      </button>
      <div className="filter__container">
        <FilterNav />
      </div>
    </div>
  );
}
