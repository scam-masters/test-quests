import Header from './components/header/header';
import Footer from './components/footer/footer';
import Button from './components/button/button';

function App() {
	return (
		<div className='bg-tq-white dark:bg-tq-black h-screen w-screen'>
			<Header/>
			<Button type="blue">This is a button</Button>
			<Footer />
		</div>
	);
}

export default App;
