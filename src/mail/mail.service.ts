import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly transporter: any;

  constructor(private configService: ConfigService) {
    const mailConfig = this.configService.get('mail');

    this.transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: {
        user: mailConfig.auth.user,
        pass: mailConfig.auth.password,
      },
      tls: {
        rejectUnauthorized: mailConfig.starttls ? false : true,
      },
    });
  }
  /**
   * 发送重置密码邮件
   * @param to - 收件人邮箱
   * @param subject - 邮件主题
   * @param resetLink - 重置密码链接
   * @returns Promise - 返回一个Promise对象，表示邮件发送结果
   */
  async sendForgotPasswordMail(
    to: string,
    subject: string,
    resetLink: string,
  ): Promise<any> {
    const call = to.split('<')[0];
    const html = `
    <!DOCTYPE html>
      <html lang="zh-cmn-Hans">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>密码重置</title>
      <style type="text/css">
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          padding: 20px;
          max-width: 600px;
          margin: 40px auto;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: #fff;
        }
        .header {
          background-color: #84bfff;
          padding: 10px;
          text-align: center;
          color: #0070ff;
          border-bottom: 1px solid #ddd;
        }
        .content {
          padding: 20px;
          text-align: center;
          color: #2bbd88;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #39c5bb;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
        }
        .footer {
          background-color: #84bfff;
          padding: 10px;
          text-align: center;
          color:#00a2ff;
          border-top: 1px solid #ddd;
        }
      </style>
      </head>
      <body>
      <div class="container">
        <div class="header">
          <h2>密码重置</h2>
        </div>
        <div class="content">
        <p style="text-align: left;">亲爱的${call}：</p>
          <p>您收到此电子邮件是因为我们收到了您账户的密码重置请求。邮件五分钟内有效。</p>
          <a href="${this.configService.get('webSite')}/forgotPassword/${resetLink}" class="button">重置密码</a>
          <p>如果您没有请求重置密码，请忽略此电子邮件，您的密码不会更改。</p>
        </div>
        <div class="footer">
          <p>此为系统邮件，请勿回复</p>
          <p>佳雯的日记 © 2024</p>
        </div>
      </div>
      </body>
      </html>
    `;
    const mailOptions = {
      from: this.configService.get('mail').from,
      to,
      subject,
      html,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
