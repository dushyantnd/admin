import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if the token exists in localStorage or cookies
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if token does not exist
      router.push("/us/auth/login");
    }
  }, [router]);

  return (
    <div className="bg-primary text-white p-5">
      <h1 className="display-4 fw-bold">Hello, Bootstrap!</h1>
    </div>
  );
}
