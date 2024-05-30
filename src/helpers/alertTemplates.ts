import Swal from 'sweetalert2';

export async function alertError(msg: string | null = null) {
	await Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: msg ? msg : 'Algo salió mal!',
	})
}
