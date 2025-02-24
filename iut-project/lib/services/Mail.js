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
    async sendFavoriteMail(to, username) {
        await this.setupTransporter();

        try {
            const info = await this.transporter.sendMail({
                from: `"Filmothèque" <${this.transporter.options.auth.user}>`,
                to,
                subject: "Film ajouté a vos favoris!",
                text: `Bonjour ${username},\n\nUn film a été ajouter a vos favoris !`,
                html: `<h1>Bonjour, ${username} !</h1><p>Merci d ajouter un film dans vos favoris. Profitez bien de nos services !</p>`
            });

            console.log("E-mail envoyé : ", info.messageId);
            console.log("Aperçu du mail : ", nodemailer.getTestMessageUrl(info));
        } catch (error) {
            console.error("Erreur lors de l'envoi du mail : ", error);
        }
    }
    async sendModifFavoriteMail(users, movieTitle) {
        await this.setupTransporter();

        try {
            const info = await this.transporter.sendMail({
                from: `"Filmothèque" <${this.transporter.options.auth.user}>`,
                to,
                subject: "Film modifié dans vos favoris!",
                text: `Un film a été modifier dans vos favoris !`,
                html: `Le film "${movieTitle}" que vous avez mis en favori a été mis à jour. Consultez les nouvelles informations !`
            });

            console.log("E-mail envoyé : ", info.messageId);
            console.log("Aperçu du mail : ", nodemailer.getTestMessageUrl(info));
        } catch (error) {
            console.error("Erreur lors de l'envoi du mail : ", error);
        }
    }
    async sendNewMovieEmail(users, movieTitle) {
        await this.setupTransporter();

        try {
            const sendMailPromises = users.map(user =>
                this.transporter.sendMail({
                    from: `"Filmothèque" <${this.transporter.options.auth.user}>`,
                    to: user.email,
                    subject: `Nouveau film ajouté : ${movieTitle}`,
                    text: `Bonjour ${user.username},\n\nUn nouveau film "${movieTitle}" a été ajouté à la Filmothèque !\nVenez le découvrir.`,
                    html: `<h1>Nouveau film ajouté : ${movieTitle}</h1>
                       <p>Bonjour ${user.username},</p>
                       <p>Un nouveau film <strong>${movieTitle}</strong> vient d’être ajouté à la Filmothèque !</p>
                       <p>Connectez-vous dès maintenant pour le découvrir.</p>`
                })
            );

            const results = await Promise.all(sendMailPromises);
            results.forEach(info => console.log("Aperçu du mail : ", nodemailer.getTestMessageUrl(info)));

        } catch (error) {
            console.error("Erreur lors de l'envoi des mails : ", error);
        }
    }
    async sendEmailWithAttachment(to, attachmentPath) {
        await this.setupTransporter();

        try {
            const info = await this.transporter.sendMail({
                    from: `"Filmothèque" <${this.transporter.options.auth.user}>`,
                    to,
                    attachments: [{ filename: 'films.csv', path: attachmentPath }],
                    subject: `Liste CSV`,
                    text: `Voici le csv `,
            });
            console.log("E-mail envoyé : ", info.messageId);
            console.log("Aperçu du mail : ", nodemailer.getTestMessageUrl(info));
        }
    catch(err) {
        console.error("Erreur lors de l'envoi des mails : ", err);

    }
}

};
