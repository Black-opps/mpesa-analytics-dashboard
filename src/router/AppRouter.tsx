import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "red",
        color: "white",
        zIndex: 999999,
        fontSize: "50px",
        padding: "100px",
      }}
    >
      ROUTER WORKS
    </div>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
