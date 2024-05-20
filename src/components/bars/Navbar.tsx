import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faGear } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
	return (
		<div className="navbar-container">
			<div className='navbar-left'>
				<Link to='/' className="navbar-option">
					<FontAwesomeIcon icon={faHouse} className="nav-icon" />
					<span>Menú</span>
				</Link>
			</div>
			<div className='navbar-center'>
				<div className="navbar-title">
					<h1>PINTURILLO</h1>
				</div>
			</div>
			<div className='navbar-right'>
				<Link to='/admin' className="navbar-option">
					<FontAwesomeIcon icon={faGear} className="nav-icon" />
					<span>Admin</span>
				</Link>
			</div>
		</div>
	);
};

export default Navbar;
