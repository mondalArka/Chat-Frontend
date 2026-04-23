import Login from "./features/Auth/components/Login";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoutePaths } from "./routes/routes";
import Otp from "./components/Otp";
import { ProtectedRoute } from "./routes/Protected.routes";
import { Dashboard } from "./features/Chat/Dashboard";
function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
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
