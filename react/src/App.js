import React, { useState, useEffect } from "react";
import { PrimeReactProvider } from 'primereact/api';
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Landing from "./pages/Landing";
import M1Learning from "./pages/M1Learning";
import M1Exercise from "./pages/M1Exercise";
import NotfoundERR from "./pages/NotfoundERR";
import DndExercise from "./pages/DragAndDropExercise";

function App() {

  const [currentPage, setCurrentPage] = useState("landing");

  useEffect(() => {
    const storedPage = sessionStorage.getItem("currentPage");
    if (storedPage) {
      setCurrentPage(storedPage);
    }
  }, []);

  const switchPage = (page) => {
    setCurrentPage(page);
    sessionStorage.setItem("currentPage", page);
  };

  return (
    <div className="bg-tq-white dark:bg-tq-black h-screen w-screen overflow-y-auto scrollbar-hide">
      <Header />
      {currentPage === "landing" ? (
        <Landing switchPage={switchPage} />
      ) : currentPage === "m1learning" ? (
        <M1Learning switchPage={switchPage} />
      ) : currentPage === "m1exercise" ? (
        <M1Exercise switchPage={switchPage} />
      ) : currentPage === "exercise" ? (
        <DndExercise switchPage={switchPage} />
      ) : (
        <NotfoundERR switchPage={switchPage} />
      )}
      <Footer />
    </div>
  );
}

export default function MyApp({ Component, pageProps }) {
  return (
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  );
}
