import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ICurrentUser } from 'src/domain/models/current-user.model';
import { join } from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendWelcome(user: ICurrentUser): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'noreply@banka.com',
        subject: 'Welcome to banka',
        template: './welcome',
        attachments: [
          {
            filename: 'bankaLogo.svg',
            path: join(__dirname, '..', '..', 'public/images/bankaLogo.svg'),
            cid: 'logo',
          },
        ],
        context: {
          name: user.firstName + ' ' + user.lastName,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
