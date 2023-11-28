import './header.css'
import logo from '../../assets/logo.png'

function Header() {
	return (
		<header>
			<img src={logo} alt='logo'/>
			<h1>Test Quests</h1>
		</header>
	)
}

export default Header
