// pages/404.tsx

import Link from "next/link";

const Custom404 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-4">
        The page you are looking for does not exist.
      </p>
      <Link href="/">
        <span className="text-blue-500 hover:underline cursor-pointer">
          Go back to Home
        </span>
      </Link>
    </div>
  );
};

export default Custom404;
