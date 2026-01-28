"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const entities_1 = require("../entities");
const client_entity_1 = require("../entities/client.entity");
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
const aircraft_entity_1 = require("../entities/aircraft.entity");
const destination_entity_1 = require("../entities/destination.entity");
const flight_series_entity_1 = require("../entities/flight-series.entity");
const seat_reservation_entity_1 = require("../entities/seat-reservation.entity");
const passenger_entity_1 = require("../entities/passenger.entity");
const booking_entity_1 = require("../entities/booking.entity");
const booking_passenger_entity_1 = require("../entities/booking-passenger.entity");
const client_ledger_entity_1 = require("../entities/client-ledger.entity");
const sales_order_entity_1 = require("../entities/sales-order.entity");
const sales_order_item_entity_1 = require("../entities/sales-order-item.entity");
const supplier_entity_1 = require("../entities/supplier.entity");
const purchase_order_entity_1 = require("../entities/purchase-order.entity");
const purchase_order_item_entity_1 = require("../entities/purchase-order-item.entity");
const task_entity_1 = require("../entities/task.entity");
const crew_entity_1 = require("../entities/crew.entity");
const key_account_entity_1 = require("../entities/key-account.entity");
const key_account_ledger_entity_1 = require("../entities/key-account-ledger.entity");
const key_account_fuel_price_entity_1 = require("../entities/key-account-fuel-price.entity");
const vehicle_entity_1 = require("../entities/vehicle.entity");
const inventory_ledger_entity_1 = require("../entities/inventory-ledger.entity");
const sale_entity_1 = require("../entities/sale.entity");
const conversion_entity_1 = require("../entities/conversion.entity");
const loyalty_points_ledger_entity_1 = require("../entities/loyalty-points-ledger.entity");
const checkin_record_entity_1 = require("../entities/checkin-record.entity");
const staff_leave_entity_1 = require("../entities/staff-leave.entity");
const getDatabaseConfig = (configService) => ({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [entities_1.Staff, entities_1.Department, entities_1.ChatRoom, entities_1.ChatMessage, entities_1.Notice, entities_1.Country, entities_1.SalesRep, entities_1.Region, entities_1.Route, entities_1.LoginHistory, entities_1.Station, entities_1.FuelPrice, client_entity_1.Client, product_entity_1.Product, category_entity_1.Category, aircraft_entity_1.Aircraft, destination_entity_1.Destination, flight_series_entity_1.FlightSeries, seat_reservation_entity_1.SeatReservation, passenger_entity_1.Passenger, booking_entity_1.Booking, booking_passenger_entity_1.BookingPassenger, client_ledger_entity_1.ClientLedger, sales_order_entity_1.SalesOrder, sales_order_item_entity_1.SalesOrderItem, supplier_entity_1.Supplier, purchase_order_entity_1.PurchaseOrder, purchase_order_item_entity_1.PurchaseOrderItem, task_entity_1.Task, crew_entity_1.Crew, key_account_entity_1.KeyAccount, key_account_ledger_entity_1.KeyAccountLedger, key_account_fuel_price_entity_1.KeyAccountFuelPrice, vehicle_entity_1.Vehicle, inventory_ledger_entity_1.InventoryLedger, sale_entity_1.Sale, conversion_entity_1.Conversion, loyalty_points_ledger_entity_1.LoyaltyPointsLedger, checkin_record_entity_1.CheckinRecord, staff_leave_entity_1.StaffLeave],
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: false,
    extra: {
        connectionLimit: 10,
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true,
        keepAliveInitialDelay: 0,
        enableKeepAlive: true,
    },
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map