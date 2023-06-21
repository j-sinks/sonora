import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import './App.scss';
import Header from "./components/Header/Header";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Set from "./pages/Set/Set";
import Profile from "./pages/Profile/Profile";
import Sets from "./pages/Sets/Sets";
import Sounds from "./pages/Sounds/Sounds";
import Error from "./pages/Error/Error";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
            <Route path="/register" element={<Register />}  />
            <Route path="/" element={<Home />}  />
            <Route path="home" element={<Navigate to="/" />} />
            <Route path="set/:subgenre" element={<Set />}  />
            <Route path="profile/:userId" element={<Profile />}  />
            <Route path="profile/:userId/sets" element={<Sets />}  />
            <Route path="profile/:userId/sets/:setId" element={<Set />}  />
            <Route path="profile/:userId/sounds" element={<Sounds />}  />
            <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
