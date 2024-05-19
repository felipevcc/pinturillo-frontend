import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/* import { faPencil } from '@fortawesome/free-solid-svg-icons'; */

const Navbar = () => {
	const navigate = useNavigate();

	/* useEffect(() => {
	}, []); */

	return (
		<div className="navbar-container">
			<div className="navbar-title">
				<h1>PINTURILLO</h1>
			</div>
			<div className="navbar-content">
			</div>
		</div>
	);
};

export default Navbar;
