import './search.css'

const SkeletonSearch = () => {
    return (
        <div className="skeleton-search">
            <div className="skeleton-search__input"></div>
            <div className="skeleton-search__button"></div>
            <div className="skeleton-search__filter"></div>
        </div>
    );
};

export default SkeletonSearch;