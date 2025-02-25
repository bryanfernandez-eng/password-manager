import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Spinner, Flex } from "@chakra-ui/react";

const ProtectedRoute = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return !user ? <Navigate to="/login" replace /> : <Outlet />;
};

export default ProtectedRoute;
