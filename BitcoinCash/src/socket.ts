import * as io from 'socket.io';

require('dotenv').config();

class SocketServer {
	public sio: any;

	constructor() {
		
	}

	public initialize(httpServer) {
		this.sio = io.listen(httpServer);
	}

	public emit(event, data) {
		this.sio.emit(event, data);
	}
}

export default new SocketServer();