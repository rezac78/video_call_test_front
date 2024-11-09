import { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { RoomContext } from "../../context/RoomContext";
import Loading from "../loading";
import { useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element, redirectPath = "/login" }) => {
  const { isAuthenticated } = useContext(RoomContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectPath, { state: { from: location.pathname } });
    }
  }, [isAuthenticated, redirectPath, navigate, location.pathname]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
        <Loading />
      </div>
    );
  }

  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  redirectPath: PropTypes.string,
};

export default ProtectedRoute;
