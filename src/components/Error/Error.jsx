import error from './error.module.css';

const Error = ({ message }) => {
    return (
        <div className={error.error}>
            <p>{message}</p>
            <button className={error.redirectButton}>
                <a href="/">Volver a la página principal</a>
            </button>
        </div>
    );
};

export default Error;