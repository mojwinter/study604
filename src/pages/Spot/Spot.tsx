import { useParams } from "react-router-dom";

const Spot = () => {
    const { id } = useParams();

  return <h1>Spot Page {id}</h1>;
}

export default Spot;