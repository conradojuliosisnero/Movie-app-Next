import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "../components/Nav/Nav";
import Footer from "../components/footer/Footer";
import { store } from "./app/store";
import { Provider } from "react-redux";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MoviesCon 2.0",
  description: "web de peliculas funcional con API de TMDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <Provider store={store}>
        <body className={inter.className}>
          <Nav />
          {children}
          <Footer />
        </body>
      </Provider>
    </html>
  );
}
