import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ListingsModule } from './modules/listings/listings.module';
import { CitiesModule } from './modules/cities/cities.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AdminModule } from './modules/admin/admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';
import { VisitsModule } from './modules/visits/visits.module';
import { MessagesModule } from './modules/messages/messages.module';

import { User } from './modules/users/entities/user.entity';
import { City } from './modules/cities/entities/city.entity';
import { Neighborhood } from './modules/cities/entities/neighborhood.entity';
import { Listing } from './modules/listings/entities/listing.entity';
import { ListingImage } from './modules/listings/entities/listing-image.entity';
import { PropertyType } from './modules/listings/entities/property-type.entity';
import { Favorite } from './modules/favorites/entities/favorite.entity';
import { Report } from './modules/reports/entities/report.entity';
import { Notification } from './modules/notifications/entities/notification.entity';
import { AdminAction } from './modules/admin/entities/admin-action.entity';
import { Inquiry } from './modules/inquiries/entities/inquiry.entity';
import { VisitRequest } from './modules/visits/entities/visit-request.entity';
import { Message } from './modules/messages/entities/message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        const isProd = config.get<string>('NODE_ENV') === 'production';

        return {
          type: 'postgres',
          url: url,
          host: !url ? config.get<string>('DATABASE_HOST') : undefined,
          port: !url ? config.get<number>('DATABASE_PORT') : undefined,
          username: !url ? config.get<string>('DATABASE_USER') : undefined,
          password: !url ? config.get<string>('DATABASE_PASSWORD') : undefined,
          database: !url ? config.get<string>('DATABASE_NAME') : undefined,
          entities: [
            User, City, Neighborhood, Listing, ListingImage,
            PropertyType, Favorite, Report, Notification,
            AdminAction, Inquiry, VisitRequest, Message,
          ],
          synchronize: config.get<string>('NODE_ENV') === 'development',
          ssl: isProd ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 100,
    }]),
    AuthModule,
    UsersModule,
    ListingsModule,
    CitiesModule,
    FavoritesModule,
    ReportsModule,
    AdminModule,
    NotificationsModule,
    InquiriesModule,
    VisitsModule,
    MessagesModule,
  ],
})
export class AppModule { }
