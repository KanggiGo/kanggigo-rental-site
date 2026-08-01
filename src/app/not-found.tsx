import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif" }}>
        <div style={{ padding: "6rem 1rem", textAlign: "center" }}>
          <h1>Page not found</h1>
          <p>
            <Link href="/en">Back to homepage</Link>
          </p>
        </div>
      </body>
    </html>
  );
}
