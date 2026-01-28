import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Staff, Department, ChatRoom, ChatMessage, Notice, Country, SalesRep, Region, Route, LoginHistory, Station, FuelPrice } from '../entities';
import { Client } from '../entities/client.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Aircraft } from '../entities/aircraft.entity';
import { Destination } from '../entities/destination.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { SeatReservation } from '../entities/seat-reservation.entity';
import { Passenger } from '../entities/passenger.entity';
import { Booking } from '../entities/booking.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
import { ClientLedger } from '../entities/client-ledger.entity';
import { SalesOrder } from '../entities/sales-order.entity';
import { SalesOrderItem } from '../entities/sales-order-item.entity';
import { Supplier } from '../entities/supplier.entity';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { PurchaseOrderItem } from '../entities/purchase-order-item.entity';
import { Task } from '../entities/task.entity';
import { Crew } from '../entities/crew.entity';
import { KeyAccount } from '../entities/key-account.entity';
import { KeyAccountLedger } from '../entities/key-account-ledger.entity';
import { KeyAccountFuelPrice } from '../entities/key-account-fuel-price.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { InventoryLedger } from '../entities/inventory-ledger.entity';
import { Sale } from '../entities/sale.entity';
import { Conversion } from '../entities/conversion.entity';
import { LoyaltyPointsLedger } from '../entities/loyalty-points-ledger.entity';
import { CheckinRecord } from '../entities/checkin-record.entity';
import { StaffLeave } from '../entities/staff-leave.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [Staff, Department, ChatRoom, ChatMessage, Notice, Country, SalesRep, Region, Route, LoginHistory, Station, FuelPrice, Client, Product, Category, Aircraft, Destination, FlightSeries, SeatReservation, Passenger, Booking, BookingPassenger, ClientLedger, SalesOrder, SalesOrderItem, Supplier, PurchaseOrder, PurchaseOrderItem, Task, Crew, KeyAccount, KeyAccountLedger, KeyAccountFuelPrice, Vehicle, InventoryLedger, Sale, Conversion, LoyaltyPointsLedger, CheckinRecord, StaffLeave],
  synchronize: false, // Disabled to avoid schema conflicts
  logging: configService.get<string>('NODE_ENV') === 'development',
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: false,
  // Connection pool settings to prevent ECONNRESET errors
  extra: {
    connectionLimit: 10,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    // Keep connections alive
    keepAliveInitialDelay: 0,
    enableKeepAlive: true,
  },
});
