import React, { useState } from 'react';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Landing from './pages/Landing';
import M1Learning from './pages/M1Learning';
import M1Exercise from './pages/M1Exercise';
import NotfoundERR from './pages/NotfoundERR';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const switchPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className='bg-tq-white dark:bg-tq-black h-screen w-screen overflow-y-auto scrollbar-hide'>
      <Header />
      {currentPage === 'landing' ? (
        <Landing switchPage={switchPage} />
      ) : currentPage === 'm1learning' ? (
        <M1Learning switchPage={switchPage} />
      ) : currentPage === 'm1exercise' ? (
        <M1Exercise switchPage={switchPage} />
      ) : (
		<NotfoundERR switchPage={switchPage}/>
	  )}
      <Footer />
    </div>
  );
}

export default App;
