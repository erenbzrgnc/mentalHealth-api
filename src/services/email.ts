import nodemailer from 'nodemailer';

interface TransporterConfig {
    service: string;
    auth: {
        user: string;
        pass: string;
    };
    secure: boolean;
    port: number;
}

// Function to create transporter configuration
const createTransporterConfig = (): TransporterConfig => ({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    secure: true, // use SSL
    port: 465 // SMTP port for SSL
});

export const sendConfirmationEmail = (userEmail: string, confirmationToken: string): void => {
    // Create transporter configuration at the time of sending the email
    const transporterConfig = createTransporterConfig();
    const transporter = nodemailer.createTransport(transporterConfig);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Email Confirmation',
        html: `
            <h1>Email Confirmation</h1>
            <p>Please click the link below to confirm your email address:</p>
            <a href="http://localhost:8080/auth/confirm-email?token=${confirmationToken}">Confirm Email</a>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};
