export default function page(props) {
  console.log(props);
  const { category } = props.params
  return <div>{ category}</div>;
}
