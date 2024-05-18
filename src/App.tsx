import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useNavigate
} from 'react-router-dom';
import './App.scss';
import Home from './pages/Home';
/* import Join from './pages/Join';
import Results from './pages/Results';
import Room from './pages/Room'; */

function App() {

	return (
		<Router>
			<div className="app-container">
				<Routes>
					<Route path="/" element={<Home />} />
					{/* <Route path="/*" element={<MainLayout />} /> */}
				</Routes>
			</div>
		</Router>
	);
}

export default App;
