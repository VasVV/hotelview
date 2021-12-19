import './App.css';
import Auth from './Auth';
import Hotels from './hotels';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Auth />} />
          <Route path="/hotels" element={<Hotels />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
