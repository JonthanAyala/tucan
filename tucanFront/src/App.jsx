import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Login from './components/Login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* <Route path="/" element={<Index />} />
        <Route path="/500" element={<ServerError />} /> */}
      </Routes>
    </Router>
  )
}

export default App
