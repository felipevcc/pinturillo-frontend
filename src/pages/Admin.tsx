import React, { useEffect, useState } from 'react';
import Navbar from '../components/bars/Navbar';
import Categories from '../components/admin/Categories';
import Words from '../components/admin/Words';

const Admin = () => {

	return (
		<div className="admin-container">
			<Navbar />
			<div className="admin-content">
				<h2>Gestión de categorías y palabras</h2>
				<div className='admin-cards'>
					<Categories />
					<Words />
				</div>
			</div>
		</div>
	);
};

export default Admin;
