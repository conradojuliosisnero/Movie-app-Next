import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/firebase/servicesFirebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useContext } from "react";
import AuthContext from "@/context/AuthContext";

export const useAuthUser = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const userLogged = user !== null ? true : false;
      setIsLoggedIn(userLogged);
      // Redirige a los usuarios no autenticados a "/" excepto si ya están en "/"
      if (!userLogged && pathname !== "/") {
        router.push("/");
      }
      // Redirige a los usuarios autenticados a "/home" si intentan acceder a "/" o "/forgot-password"
      else {
        if (
          userLogged &&
          (pathname === "/" || pathname === "/forgot-password")
        ) {
          router.push("/home");
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, router, setIsLoggedIn]);
};
