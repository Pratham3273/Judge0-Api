import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./components/Home";
import Main from "./components/Main";
import Hello from "./components/hello";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/main" element={<Main />} />
          <Route exact path="/hello" element={<Hello />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;