import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link href="/">
        <div className="go-home">Go Back to Home</div>
      </Link>
    </div>
  );
};

export default NotFoundPage;
