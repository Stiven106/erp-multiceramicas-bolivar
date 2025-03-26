import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import SalesModule from "./pages/SalesModule";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/" element={<Login />} />
        <Route path="/SalesModule" element={<SalesModule />} />
      </Routes>
    </Router>
  );
};

export default App;
