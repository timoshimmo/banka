import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ICurrentUser } from 'src/domain/models/current-user.model';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendWelcome(user: ICurrentUser, domain: string): Promise<void> {
    const logoPath = domain + '/images/';
    const logo = logoPath + 'logo.svg';
    const banner = logoPath + 'waitlist-banner.svg';

    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'noreply@banka.com',
        subject: 'Welcome to banka',
        template: './welcome',
        context: {
          name: user.firstName + ' ' + user.lastName,
          logo,
          banner,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
