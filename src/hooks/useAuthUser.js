import { auth } from "@/firebase/servicesFirebase";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useContext } from "react";
import AuthContext from "@/context/AuthContext";

export const useAuthUser = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoggedIn, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const userLogged = user !== null ? true : false;
      setIsLoggedIn(userLogged);
      if (!userLogged && pathname !== "/") {
        router.push("/");
      } else {
        setIsLoggedIn(true);
        if (
          userLogged &&
          (pathname === "/" || pathname === "/forgot-password")
        ) {
          router.push("/home");
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, router, isLoggedIn,setIsLoggedIn]);
};
