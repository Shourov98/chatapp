import amqp from 'amqplib'

let channel: amqp.Channel;

export const connectRabbitMQ = async() => {
    try {
        const connection  = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RABBITMQ_DEFAULT_HOST,
            port: 5672,
            username: process.env.RABBITMQ_DEFAULT_USER,
            password: process.env.RABBITMQ_DEFAULT_PASSWORD,
        })

        channel = await connection.createChannel();
        console.log("✅ Connected to RabbitMQ.");
        
    } catch (error) {
        console.log("❌ Failed to connect to RabbitMQ", error);
        
    }
}