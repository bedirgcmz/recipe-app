import { useState } from "react";
import defaultImage from "../assets/default.webp";

const AiImageGenerator = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <h3>Ai Image Generator</h3>
      <img src={defaultImage} alt="Ai content" />
      <div></div>
      <p>Loading...</p>
      <div>
        <input type="text" />
        <button></button>
      </div>
    </div>
  );
};

export default AiImageGenerator;
