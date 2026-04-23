import Login from "./features/Auth/components/Login";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoutePaths } from "./routes/routes";
import Otp from "./components/Otp";
function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path={RoutePaths.login} element={<Login />} />
          <Route path={RoutePaths.otp} element={<Otp />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
