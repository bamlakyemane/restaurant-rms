import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, Button } from "../components/ui";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function RoleRoute({ roles, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return (
      <Card className="max-w-md mx-auto mt-20 text-center">
        <ShieldAlert className="mx-auto text-red-500 mb-3" size={36} />
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Access denied
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Your role (<span className="font-medium">{user.role}</span>) can't
          view this page.
        </p>
        <Link to="/">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </Card>
    );
  }

  return children;
}
