export const dateConvert = (dateMovie) => {
  const date = new Date(dateMovie);
  const year = date.getFullYear();
  return year;
};

export function colors(percentag) {
  if (percentag >= 7) {
    return "#33f04d";
  } else if (percentag >= 5) {
    return "#f0d531";
  } else {
    return "#f04d4d";
  }
}

// Función para formatear la fecha
export function formatDate(inputDate) {
  console.log(inputDate);
  // Validar que inputDate tenga un valor
  if (!inputDate) {
    console.error("inputDate is undefined or empty");
    return "";
  }
  // Separar el día, mes y año
  const [year, day, month] = inputDate.split("-").map(Number);

  // Crear un objeto Date
  const date = new Date(year, month - 1, day); // Restar 1 al mes porque los meses en JS son base 0

  // Formatear la fecha en formato "Mes Día, Año"
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("es-ES", options);

  // Obtener el mes y año
  const calculatedMonth = date.getMonth() + 1; // Sumar 1 para que sea en base 1
  const calculatedYear = date.getFullYear();

  return `${formattedDate}`;
}