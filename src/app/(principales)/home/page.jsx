import dynamic from "next/dynamic";
import SkeletonHome from "@/components/Home/SkeletonHome";

const Home = dynamic(() => import("@/components/Home/Home"), {
  loading: () => <SkeletonHome />,
});

export default function page() {
  return <Home />;
}
