import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';
//import hbs from 'nodemailer-express-handlebars';
import handlebars from 'handlebars';
import exphbs from 'express-handlebars';
import SendmailTransport from 'nodemailer/lib/sendmail-transport';
import fs from 'fs';

const { host, port, user, pass } = require('../config/mail.json');

interface ITo{
    name: string | undefined;
    address: string;
}

export default class Mailer {   
    
    private transport: Transporter;

    constructor(){
        this.transport = nodemailer.createTransport({
            host,
            port,
            auth: {
                user,
                pass
            }
        });
    }

    async sendMail(to: ITo, subject: string, html: string){
        this.transport.sendMail({
            from: {name: 'DellasNutri', address: 'noreply@dellas.com.br'},
            to: {name: to.name || 'anderson.santos@outlook.com', address: to.address},
            subject,
            html  
        })
    }

}


/*const viewPath = path.resolve(__dirname, '../resources/mail');

transport.use('compile', hbs({
    viewEngine: {
        extName: ".hbs",
        partialsDir: viewPath,
        defaultLayout: false
    },
    viewPath,
    extName: '.html',
}));*/