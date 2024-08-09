import { auth } from "@/firebase/servicesFirebase";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useContext } from "react";
import AuthContext from "@/context/AuthContext";

export const useAuthUser = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const userLogged = user !== null;
      console.log(userLogged);
      if (userLogged) {
        setIsLoggedIn(true);
        if (pathname === "/" || pathname === "/forgot-password") {
          router.push("/home");
        }
      } else {
        setIsLoggedIn(false);
        if (pathname !== "/") {
          router.push("/");
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, router, setIsLoggedIn]);
};
