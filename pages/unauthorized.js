import Link from 'next/link';

const Unauthorized = () => {
  return (
    <div className="container mt-5 text-center">
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem' }}></i>
        <h4 className="mt-2">Unauthorized Access</h4>
        <p>You do not have permission to access this page.</p>
        <p>
          <Link href="/login">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
