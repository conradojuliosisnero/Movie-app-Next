import PersonDetails from "@/components/Person/PersonDetails";

export default function page({ params }) {
  const { id } = params;
  return <PersonDetails id={id} />;
}
