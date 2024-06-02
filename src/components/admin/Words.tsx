import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getCategories } from '../../services/categories';
import { getWords, createWord, updateWord, deleteWord } from '../../services/words';
import { alertError, alertTemporalSuccess, alertDelete } from '../../helpers/alertTemplates';
import { Category } from '../../models/category/category.interface';
import { Word } from '../../models/word/word.interface';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const Words = () => {
	const [word, setWord] = useState<Word>({
		id: null,
		text: null,
		categoryId: null,
	});

	const [categories, setCategories] = useState([]);
	const [words, setWords] = useState([]);

	const [showWordModal, setShowWordModal] = useState(false);
	const handleShowWordModal = () => {
		getAllCategories();
		setShowWordModal(true);
	};
	const handleCloseWordModal = () => {
		getAllWords();
		setWord({
			id: null,
			text: null,
			categoryId: null,
		});
		setShowWordModal(false);
	};

	useEffect(() => {
		getAllWords();
	}, []);

	const getAllWords = () => {
		getWords().then((data) => {
			setWords(data);
		}).catch(async (error) => {
			console.error('Error al obtener las palabras:', error);
			await alertError('Error: servicio caído');
		});
	}

	const getAllCategories = () => {
		getCategories().then((data) => {
			setCategories(data);
		}).catch(async (error) => {
			console.error('Error al obtener las categorías:', error);
			await alertError('Error: servicio caído');
		});
	}

	const handleCreateWord = () => {
		setWord({
			id: null,
			text: null,
			categoryId: null,
		});
		// Open modal
		handleShowWordModal();
	};
	const handleEditWord = (word: any) => {
		setWord(word);
		// Open modal
		handleShowWordModal();
	};
	const handleDeleteWord = async (word: any) => {
		// Deletion confirmation
		if (!await alertDelete()) return
		// Delete word
		deleteWord(word.id).then(async () => {
			await alertTemporalSuccess('Palabra eliminada exitosamente');
		}).catch(async (error) => {
			console.error('Error al eliminar la palabra:', error);
			await alertError(error.message, 'Error al eliminar la palabra');
		}).finally(() => {
			// Close modal
			handleCloseWordModal();
		});
	};

	const createNewWord = async () => {
		if (!word.text || word.text.trim() === '' || !word.categoryId) {
			await alertError('Todos los campos son obligatorios');
			return;
		}
		// Create word
		createWord(word).then(async (data) => {
			console.log('Palabra creada:', data);
			await alertTemporalSuccess('Palabra creada exitosamente');
		}).catch(async (error) => {
			console.error('Error al crear la palabra:', error);
			await alertError(error.message, 'Error al crear la palabra');
		}).finally(() => {
			// Close modal
			handleCloseWordModal();
		});
	}

	const updateWordData = async () => {
		if (!word.text || word.text.trim() === '') {
			await alertError('El nombre de la palabra es obligatorio');
			return;
		}
		// Update word
		updateWord(word).then(async (data) => {
			console.log('Palabra actualizada:', data);
			await alertTemporalSuccess('Palabra actualizada exitosamente');
		}).catch(async (error) => {
			console.error('Error al actualizar la palabra:', error);
			await alertError(error.message, 'Error al actualizar la palabra');
		}).finally(() => {
			// Close modal
			handleCloseWordModal();
		});
	}

	return (
		<>
			<div className="card">
				<div className="card-header d-flex justify-content-between gap-3 px-4">
					<h3>Palabras</h3>
					<button className="btn btn-primary" onClick={handleCreateWord}>
						<FontAwesomeIcon icon={faPlus} className="me-2" />
						Agregar palabra
					</button>
				</div>
				<div className="card-body">
					<div className="table-responsive my-4 mx-2">
						<table className="table table-bordered" id="category_table">
							<thead>
								<tr>
									<th>Palabra</th>
									<th>Acciones</th>
								</tr>
							</thead>
							<tbody>
								{words.map((word: Word) => (
									<tr key={word.id}>
										<td>{word.text}</td>
										<td className='actions d-flex justify-content-center gap-3'>
											<button
												className="btn btn-warning"
												onClick={() => handleEditWord(word)}
											>
												<FontAwesomeIcon icon={faPencil} />
												<span className="ms-2">Editar</span>
											</button>
											<button
												className="btn btn-danger"
												onClick={() => handleDeleteWord(word)}
											>
												<FontAwesomeIcon icon={faTrash} />
												<span className="ms-2">Eliminar</span>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Word Modal */}
			<Modal show={showWordModal} onHide={handleCloseWordModal}>
				<Modal.Header closeButton>
					<Modal.Title>{word.id ? 'Actualizar' : 'Agregar' } palabra</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={e => { e.preventDefault(); word.id ? updateWordData() : createNewWord(); }}>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Palabra</Form.Label>
							<Form.Control
								type="string"
								placeholder="Palabra"
								autoFocus
								value={word.text || ''}
								onChange={(e) => setWord({ ...word, text: e.target.value })}
							/>
						</Form.Group>
						{!word.id &&
							<Form.Group
								className="mb-3"
								controlId="exampleForm.ControlTextarea1"
							>
								<Form.Label>Categoría</Form.Label>
								<select className="form-select"
									aria-label="Selección de categoría"
									value={word.categoryId || ''}
									onChange={(e) => setWord({ ...word, categoryId: parseInt(e.target.value) })}
								>
									<option disabled value=''>Seleccionar categoría</option>
									{categories.map((category: Category) => (
										<option key={category.id} value={category.id!}>
											{category.name}
										</option>
									))}
								</select>
							</Form.Group>
						}
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseWordModal}>
						Cerrar
					</Button>
					<Button variant="primary" onClick={word.id ? updateWordData : createNewWord}>
						Guardar
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default Words;
