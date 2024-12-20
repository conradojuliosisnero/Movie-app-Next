import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useSerieDetails(id) {
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const OPTIONS = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        include: "credentials",
      };
      try {
        const response = await fetch(`/api/series/details?id=${id}`, OPTIONS);
        if (!response.ok) {
          throw new Error("Error al obtener los detalles");
        }
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  return { details, error, loading };
}
