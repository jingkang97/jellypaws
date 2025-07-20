import { useSearchParams } from "react-router-dom";
import { Result } from "../Pages/Result";

export default function ResultPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  if (!type) return <p>No result found.</p>;

  return (
    <Result
      personality={type}
      onRestart={() => (window.location.href = "/quiz")}
    />
  );
}
