function Header() {
	return (
		<>
			<header className="fixed w-full flex flex-col justify-center items-center bg-tq-primary z-50">
				<img alt="logo" src="/assets/logo-transparent.svg" className="h-24" />
				<h1 className='font-logo text-tq-white h-0 -translate-y-11'>TEST QUESTS</h1>
			</header>
			<div className={`w-full pt-24`}></div>
		</>
	)
}

export default Header
