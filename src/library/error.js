import http from 'http';

class ClientError extends Error {
	constructor(status, message) {
		super()
		this.status = status
		this.message = http.STATUS_CODES[status] + ": " + message
	}
}


export const ERRORS = {
    ClientError
}