import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faGear, faCouch } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
	const location = useLocation();

	return (
		<div className="navbar-container">
			<div className='navbar-left'>
				{location.pathname !== '/' && (
					<Link to='/' className="navbar-option">
						<FontAwesomeIcon icon={faHouse} className="nav-icon" />
						<span>Menú</span>
					</Link>
				)}
			</div>
			<div className='navbar-center'>
				<div className="navbar-title">
					<h1>PINTURILLO</h1>
				</div>
			</div>
			<div className='navbar-right'>
				{(location.pathname !== '/join' && location.pathname !== '/') && (
					<Link to='/join' className="navbar-option">
						<FontAwesomeIcon icon={faCouch} className="nav-icon" />
						<span>Lobby</span>
					</Link>
				)}
				{(location.pathname !== '/admin' && location.pathname !== '/room') && (
					<Link to='/admin' className="navbar-option">
						<FontAwesomeIcon icon={faGear} className="nav-icon" />
						<span>Admin</span>
					</Link>
				)}
			</div>
		</div>
	);
};

export default Navbar;
