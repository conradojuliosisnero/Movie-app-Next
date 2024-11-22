import { Inter } from "next/font/google";
import "./globals.css";
import { ContextAuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/layouts/ReduxProvider";

export const metadata = {
  title: "MoviesCon 2.0 | The ultimate movie app",
  description: "site for viewing details of movies and series",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <ContextAuthProvider>
        <body className={inter.className}>
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Define default options
              className: "",
              duration: 5000,
              style: {
                background: "#363636",
                color: "#fff",
              },

              // Default options for specific types
              success: {
                duration: 3000,
                theme: {
                  primary: "green",
                  secondary: "black",
                },
              },
            }}
          />
          <ReduxProvider>{children}</ReduxProvider>
        </body>
      </ContextAuthProvider>
    </html>
  );
}
