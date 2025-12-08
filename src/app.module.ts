import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { NoticesModule } from './notices/notices.module';
import { CountriesModule } from './countries/countries.module';
import { StaffModule } from './staff/staff.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { BookingsModule } from './bookings/bookings.module';
import { RegionsModule } from './regions/regions.module';
import { StationsModule } from './stations/stations.module';
import { FuelPricesModule } from './fuel-prices/fuel-prices.module';
import { KeyAccountsModule } from './key-accounts/key-accounts.module';
import { KeyAccountLedgerModule } from './key-account-ledger/key-account-ledger.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';
import { ConversionsModule } from './conversions/conversions.module';
import { GlobalAuthGuard } from './auth/global-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    ChatModule,
    NoticesModule,
    CountriesModule,
    StaffModule,
    ProductsModule,
    CategoriesModule,
    BookingsModule,
    RegionsModule,
    StationsModule,
    FuelPricesModule,
    KeyAccountsModule,
    KeyAccountLedgerModule,
    VehiclesModule,
    InventoryModule,
    SalesModule,
    ConversionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class AppModule {}
