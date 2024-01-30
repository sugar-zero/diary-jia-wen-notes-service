import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

JwtModule.registerAsync({
  global: true,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      global: true,
      secret: configService.get('jwt.secret'),
      signOptions: {
        expiresIn: configService.get('jwt.signOptions.expiresIn'),
      },
    };
  },
});
