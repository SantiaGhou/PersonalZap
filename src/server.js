import http from 'http';
import { Client } from 'whatsapp-web.js';

const server = http.createServer((req, res) => {
 const client = new Client();
 client.on('qr', (qr) => {
    console.log('Escaneie o qr code aqui', qr);
  });

server.listen (3000)
});