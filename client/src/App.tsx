
import { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState("Checking the server...");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data: { ok: boolean }) =>
        setStatus(data.ok ? "Server is OK" : "Server answered, but not OK")
      )
      .catch(() => setStatus("Cannot reach the server"));
  }, []);

  return (
    <main style={{ fontFamily: "sans-serif", padding: 32 }}>
      <h1>MerchantRelay</h1>
      <p>{status}</p>
    </main>
  );
}
