import { Link } from "react-router";

export default function AllLabs() {
  return (
    <div>
      <h2>All Labs</h2>
      <ul>
        {[1, 2, 3, 4, 5].map((num) => (
          <li key={num}>
            <Link to={`/Labs/Lab${num}`}>Lab {num}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
