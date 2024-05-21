import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/* import { faPencil } from '@fortawesome/free-solid-svg-icons'; */
import Navbar from '../../components/bars/Navbar';

const Categories = () => {
	/* const navigate = useNavigate(); */

	/* useEffect(() => {
	}, []); */

	return (
		<div className="categories-container">
			<Navbar />
			<div className="categories-content">
				<h2>Categories</h2>
			</div>
		</div>
	);
};

export default Categories;
