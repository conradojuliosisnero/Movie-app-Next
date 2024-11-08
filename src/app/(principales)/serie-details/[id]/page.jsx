import SerieDetails from "@/components/SerieDetails/Index"

export default function page({ params }) {
    const { id } = params
  return (
    <SerieDetails id={id} />
  )
}
