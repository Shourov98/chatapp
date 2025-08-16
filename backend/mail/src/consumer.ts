import amqp from "amqplib";
import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config();

export const startSendOtpConsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RABBITMQ_DEFAULT_HOST,
            port: 5672,
            username: process.env.RABBITMQ_DEFAULT_USER,
            password: process.env.RABBITMQ_DEFAULT_PASS,
        });

        const channel = await connection.createChannel();

        const queueName = "send-otp"

        await channel.assertQueue(queueName, {durable: true});

        console.log("✅ Mail service consumer started, listeninng for otp emails.")

        channel.consume(queueName, async(msg) => {
            if(msg) {
                try {
                    // Parse the message content - handle both string and buffer
                    let messageContent;
                    try {
                        messageContent = JSON.parse(msg.content.toString());
                    } catch (parseError) {
                        console.log("❌ Failed to parse message content", parseError);
                        console.log("Message content:", msg.content.toString());
                        channel.nack(msg);
                        return;
                    }
                    
                    const {to, subject, body} = messageContent

                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        auth: {
                            user: process.env.USER,
                            pass: process.env.PASSWORD,
                        }
                    })

                    await transporter.sendMail({
                        from: "Chat app",
                        to,
                        subject,
                        text: body,
                    });

                    console.log(`OTP mail send to ${to}`);
                    channel.ack(msg);
                    
                } catch (error) {
                    console.log("❌ Failed to send otp", error);
                }
            }
        })
        
    } catch (error) {
        console.log("❌ Failed to start rabbitmq consumer", error);
        
    }
}
