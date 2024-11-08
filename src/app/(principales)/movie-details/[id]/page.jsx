import MovieDetails from "@/components/MovieDetails/Index"

export default function page({ params }) {
    const { id } = params
  return (
    <MovieDetails id={id} />
  )
}
