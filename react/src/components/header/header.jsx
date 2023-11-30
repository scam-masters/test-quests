import logo from '../../assets/logo.svg'

function Header() {
	return (
		<header className="fixed w-full flex flex-col justify-center items-center bg-primary z-50">
			<img src={logo} alt="Logo" className="h-24" />
			<h1 className='font-logo text-white h-0 -translate-y-11'>TEST QUESTS</h1>
		</header>
	)
}

export default Header
