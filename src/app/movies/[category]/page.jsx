export default function page(props) {
  const { category } = props.params;
  return <div>Search: {category}</div>;
}
