import { SMTP } from './env';
import axios from 'axios';
import * as fs from 'fs';
import { Logger } from './logger';

export class EmailService {
  private BREVO_KEY: string;
  private BREVO_URL: string;

  constructor() {
    Logger.info('EmailService initialized...');
    this.BREVO_KEY = SMTP.BREVO_KEY;
    this.BREVO_URL = SMTP.BREVO_URL;
  }

  async SendMail(email: string, otp: string) {
    const htmlTemplate = fs.readFileSync('src/v_1/emailTemplates/otpVerification.html', 'utf-8');

    const modifiedHtml = htmlTemplate
      .replace('{{DATE}}', new Date().toLocaleDateString()) // Replace {{Date}} with current date
      .replace('{{otp}}', otp);

    Logger.info('Send Mail', email, this.BREVO_KEY);

    axios.post(
      this.BREVO_URL + '/smtp/email',
      {
        to: [{ email: email }],
        subject: `OTP Verification`,
        sender: {
          name: 'BoilerPlate',
          email: 'no-reply@boilerplate.com',
        },
        htmlContent: modifiedHtml,
      },
      {
        headers: {
          'api-key': this.BREVO_KEY,
        },
      },
    );
  }
}
