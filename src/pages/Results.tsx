import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import GameResult from '../components/player/GameResult';
import Navbar from '../components/bars/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const Results: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const results = location.state?.results
		? location.state.results
				.sort((a: any, b: any) => (b?.score || 0) - (a?.score || 0))
				.slice(0, 3)
		: [];

	useEffect(() => {
		if (!results || !results.length) {
			navigate('/');
		}
		/* return () => {
			navigate(location.pathname, { replace: true, state: {} });
		} */
	}, []);

	return (
		<div className="results-container">
			<Navbar />
			<div className="results-content">
				<div className="results-content__go-back">
					<Link to="/join" className="go-back-option">
						<FontAwesomeIcon icon={faChevronLeft} className="go-back-icon" />
						<span>Volver al lobby</span>
					</Link>
				</div>
				<div className="results-content__content">
					{results.map((result: any, index: number) => (
						<GameResult
							key={index}
							playerResult={result}
							topPosition={index + 1}
							numResults={results.length}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default Results;
