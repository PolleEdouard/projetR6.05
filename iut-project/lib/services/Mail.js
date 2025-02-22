const nodemailer = require('nodemailer');

module.exports = class MailService {
    constructor(server) {
        this.server = server;
        this.transporter = null;
    }

    async setupTransporter() {
        if (!this.transporter) {

            const testAccount = await nodemailer.createTestAccount();
            this.transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // false pour TLS
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });

            console.log("Compte SMTP généré : ", testAccount);
        }
    }

    async sendWelcomeEmail(to, username) {
        await this.setupTransporter();

        try {
            const info = await this.transporter.sendMail({
                from: `"Filmothèque" <${this.transporter.options.auth.user}>`,
                to,
                subject: "Bienvenue dans la Filmothèque !",
                text: `Bonjour ${username},\n\nBienvenue ! Prêts à regarder un film ?`,
                html: `<h1>Bienvenue, ${username} !</h1><p>Merci de rejoindre la Filmothèque. Profitez bien de nos services !</p>`
            });

            console.log("E-mail envoyé : ", info.messageId);
            console.log("Aperçu du mail : ", nodemailer.getTestMessageUrl(info));
        } catch (error) {
            console.error("Erreur lors de l'envoi du mail : ", error);
        }
    }
};
