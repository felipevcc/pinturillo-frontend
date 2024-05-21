import 'bootstrap/dist/css/bootstrap.min.css';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useNavigate
} from 'react-router-dom';
import './App.scss';
import Home from './pages/Home';
import Join from './pages/Join';
import Categories from './pages/admin/Categories';
import Room from './pages/Room';
// import Results from './pages/Results';
import { PlayerProvider } from './context/PlayerContext';

function App() {

	return (
		<PlayerProvider>
			<Router>
				<div className="app-container">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/join" element={<Join />} />
						<Route path="/room" element={<Room />} />
						<Route path="/admin" element={<Categories />} />
						{/* <Route path="/*" element={<MainLayout />} /> */}
					</Routes>
				</div>
			</Router>
		</PlayerProvider>
	);
}

export default App;
