import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import './App.scss';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/register" element={<Register />}  />
            <Route path="/" element={<Home />}  />
            <Route path="home" element={<Navigate to="/" />} />
            <Route path="set" element={<Set />}  />
            <Route path="profile/:userId" element={<Profile />}  />
            <Route path="profile/:userId/sets" element={<Sets />}  />
            <Route path="profile/:userId/sets/:setId" element={<Set />}  />
            <Route path="profile/:userId/sounds" element={<Sounds />}  />
            <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
