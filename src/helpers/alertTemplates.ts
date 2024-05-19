import Swal from 'sweetalert2';

export function alertError(msg: string | null = null) {
	Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: msg ? msg : 'Algo salió mal!',
	})
}
