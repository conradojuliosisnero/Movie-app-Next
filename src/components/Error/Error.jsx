import error from './error.module.css';
import Link from 'next/link';

const Error = ({ message }) => {
    return (
        <div className={error.error}>
            <p>{message}</p>
            <button className={error.redirectButton}>
                <Link href="/home">Volver a la página principal</Link>
            </button>
        </div>
    );
};

export default Error;