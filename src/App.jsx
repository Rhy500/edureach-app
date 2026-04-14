import { useState } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import KursusPage from "./pages/KursusPage";
import VideoPage from "./pages/VideoPage";
import QuizPage from "./pages/QuizPage";
import PerformaPage from "./pages/PerformaPage";
import MentorPage from "./pages/MentorPage";
import { LoginPage, RegisterPage } from "./pages/AuthPages";

const NO_NAVBAR = ["login", "register"];

export default function App() {
  const [page, setPage] = useState("landing");

  const navigate = (target) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showNavbar = !NO_NAVBAR.includes(page);

  return (
    <div className="min-h-screen bg-white">
      {showNavbar && <Navbar activePage={page} onNavigate={navigate} />}

      {page === "landing"   && <LandingPage  onNavigate={navigate} />}
      {page === "kursus"    && <KursusPage   onNavigate={navigate} />}
      {page === "video"     && <VideoPage    onNavigate={navigate} />}
      {page === "kuis"      && <QuizPage     onNavigate={navigate} />}
      {page === "performa"  && <PerformaPage onNavigate={navigate} />}
      {page === "mentor"    && <MentorPage   onNavigate={navigate} />}
      {page === "login"     && <LoginPage    onNavigate={navigate} />}
      {page === "register"  && <RegisterPage onNavigate={navigate} />}
    </div>
  );
}