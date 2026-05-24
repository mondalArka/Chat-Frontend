import Login from "./features/Auth/components/Login";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoutePaths } from "./routes/routes";
import Otp from "./components/Otp";
import { ProtectedRoute } from "./routes/Protected.routes";
import { Dashboard } from "./features/Chat/Dashboard";
import Registration from "./features/Auth/components/Registration";
import { useAuth } from "./context/auth.context";
import { useSocket } from "./socket/socket.context";
import { useCallback, useLayoutEffect } from "react";
function App() {
  const { socket } = useSocket();
  const { isAuthenticated, user } = useAuth()
  console.log(isAuthenticated, user, "uuu")
  const handleConnectToSocket = useCallback(() => {
    if (!socket) return;

    if (isAuthenticated && user) {
      socket.on('connect', () => {
        console.log('Socket connected', socket.id);
        const userInfo = {
          userId: user.id,
          email: user.email
        };
        socket.emit('setUserInfo', userInfo);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      })

      return () => {
        if (socket) {
          socket.off('connect');
          socket.off('disconnect');
        };
      };
    }
  }, [isAuthenticated, socket, user]);

  //eslint-disable-next-line
  useLayoutEffect(() => handleConnectToSocket(), [isAuthenticated, socket, user]);
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path={RoutePaths.register} element={<Registration />} />
          <Route path={RoutePaths.login} element={<Login />} />
          <Route path={RoutePaths.otp} element={<Otp />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
