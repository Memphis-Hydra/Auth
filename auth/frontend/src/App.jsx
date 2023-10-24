// eslint-disable-next-line no-unused-vars
import React from "react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, []);

  return (
    <div className="flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default App;
