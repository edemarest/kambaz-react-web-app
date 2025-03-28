import Nav from "react-bootstrap/Nav";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export default function TOC() {
  const { pathname } = useLocation();

  return (
    <Nav variant="pills" className="flex-wrap">
      <Nav.Item>
        <Nav.Link as={Link} to="/Labs" active={pathname === "/Labs"}>
          All Labs
        </Nav.Link>
      </Nav.Item>

      {[1, 2, 3, 4, 5].map((num) => (
        <Nav.Item key={num}>
          <Nav.Link
            as={Link}
            to={`/Labs/Lab${num}`}
            id={`wd-a${num}`}
            active={pathname === `/Labs/Lab${num}`}
          >
            Lab {num}
          </Nav.Link>
        </Nav.Item>
      ))}

      <Nav.Item>
        <Nav.Link
          href="https://github.com/edemarest"
          target="_blank"
          rel="noopener noreferrer"
        >
          My GitHub
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
