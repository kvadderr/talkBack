import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class MailService {
  emailFrom = 'kvadderlesson@gmail.com';
  constructor(private readonly mailerService: MailerService) {}

  async sendForgotPassword(userMail: string, password: string) {
    return this.mailerService.sendMail({
      from: this.emailFrom,
      to: userMail,
      subject: 'Восстановление пароля Talk2Me',
      text: '',
      html: `Ваш новый пароль: ` + password,
    });
  }

  async sendCode(userMail: string, password: number) {
    return this.mailerService.sendMail({
      from: this.emailFrom,
      to: userMail,
      subject: 'Подтсверждение профиля Talk2Me',
      text: '',
      html: `Код подтверждения: ` + password,
    });
  }

}
