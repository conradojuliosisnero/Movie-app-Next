import dynamic from "next/dynamic";

const Home = dynamic(() => import("@/components/Home/Home"));

export default function page() {
  return <Home />;
}
