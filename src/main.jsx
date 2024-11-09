import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { RoomProvider } from "./context/RoomContext.jsx";
import { Home } from "./page/Home.jsx";
import { Room } from "./page/Room.jsx";
import { Dashboard } from "./page/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./page/login.jsx";

const isAuthenticated = !!localStorage.getItem("authToken");

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <RoomProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/room/:id"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              element={<Room />}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              element={<Dashboard />}
            />
          }
        />
      </Routes>
    </RoomProvider>
  </BrowserRouter>
);
