import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JsonStore } from './storage/json-store.js';
import { ContentService } from './content/content.service.js';
import { ContentController } from './content/content.controller.js';
import { AuthController } from './auth/auth.controller.js';
import { AdminGuard } from './auth/admin.guard.js';
import { ContactController } from './contact/contact.controller.js';
import { UploadsController } from './uploads/uploads.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET is not set (see api/.env.example)');
        return { secret, signOptions: { expiresIn: '8h' } };
      },
    }),
  ],
  controllers: [ContentController, AuthController, ContactController, UploadsController],
  providers: [JsonStore, ContentService, AdminGuard],
})
export class AppModule {}
