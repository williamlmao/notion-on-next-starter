import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center">
      <div className="text-3xl">Page Not Found</div>
      <Link href="/">Back to home</Link>
    </div>
  );
}
