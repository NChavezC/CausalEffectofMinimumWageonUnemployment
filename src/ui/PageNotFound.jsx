import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/");
  }
  return (
    <div>
      Page Not Found
      <button onClick={handleClick}>Go Back</button>
    </div>
  );
}

export default PageNotFound;
