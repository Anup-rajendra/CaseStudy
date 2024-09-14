const amqp = require('amqplib');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

amqp.connect('amqp://localhost').then(conn => {
    return conn.createChannel().then(ch => {
        const q = 'product_notifications';
        ch.assertQueue(q, { durable: false });
        ch.consume(q, msg => {
            if (msg.content) {
                const product = JSON.parse(msg.content.toString());
                console.log("Received product:", product);

                // Broadcast to all WebSocket clients
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(product));
                    }
                });
            }
        }, { noAck: true });
    });
});
