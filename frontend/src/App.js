import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
  return isAuth ? <Dashboard /> : <Login />;
}

export default App;
