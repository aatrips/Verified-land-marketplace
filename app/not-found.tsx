import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{maxWidth: 960, margin: "40px auto", padding: 16}}>
      <h1 style={{fontSize: 24, fontWeight: 700}}>Page not found</h1>
      <p style={{color: "#666", marginTop: 8}}>
        The page you’re looking for doesn’t exist.
      </p>
      <div style={{marginTop: 16}}>
        <Link href="/" style={{textDecoration: "none"}}>← Go back home</Link>
      </div>
    </main>
  );
}
