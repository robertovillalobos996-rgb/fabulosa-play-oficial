import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import Home from "./pages/Home";
import Social from "./pages/Social";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/social" element={<Social />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}