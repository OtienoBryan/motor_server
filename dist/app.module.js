"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_config_1 = require("./config/database.config");
const auth_module_1 = require("./auth/auth.module");
const chat_module_1 = require("./chat/chat.module");
const notices_module_1 = require("./notices/notices.module");
const countries_module_1 = require("./countries/countries.module");
const staff_module_1 = require("./staff/staff.module");
const products_module_1 = require("./products/products.module");
const categories_module_1 = require("./categories/categories.module");
const bookings_module_1 = require("./bookings/bookings.module");
const regions_module_1 = require("./regions/regions.module");
const stations_module_1 = require("./stations/stations.module");
const fuel_prices_module_1 = require("./fuel-prices/fuel-prices.module");
const key_accounts_module_1 = require("./key-accounts/key-accounts.module");
const key_account_ledger_module_1 = require("./key-account-ledger/key-account-ledger.module");
const key_account_fuel_prices_module_1 = require("./key-account-fuel-prices/key-account-fuel-prices.module");
const loyalty_points_ledger_module_1 = require("./loyalty-points-ledger/loyalty-points-ledger.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
const inventory_module_1 = require("./inventory/inventory.module");
const sales_module_1 = require("./sales/sales.module");
const conversions_module_1 = require("./conversions/conversions.module");
const login_history_module_1 = require("./login-history/login-history.module");
const checkin_records_module_1 = require("./checkin-records/checkin-records.module");
const leaves_module_1 = require("./leaves/leaves.module");
const customer_cards_module_1 = require("./customer-cards/customer-cards.module");
const visibility_reports_module_1 = require("./visibility-reports/visibility-reports.module");
const attendants_cash_hand_module_1 = require("./attendants-cash-hand/attendants-cash-hand.module");
const managers_cash_approvals_module_1 = require("./managers-cash-approvals/managers-cash-approvals.module");
const global_auth_guard_1 = require("./auth/global-auth.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: database_config_1.getDatabaseConfig,
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            chat_module_1.ChatModule,
            notices_module_1.NoticesModule,
            countries_module_1.CountriesModule,
            staff_module_1.StaffModule,
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            bookings_module_1.BookingsModule,
            regions_module_1.RegionsModule,
            stations_module_1.StationsModule,
            fuel_prices_module_1.FuelPricesModule,
            key_accounts_module_1.KeyAccountsModule,
            key_account_ledger_module_1.KeyAccountLedgerModule,
            key_account_fuel_prices_module_1.KeyAccountFuelPricesModule,
            loyalty_points_ledger_module_1.LoyaltyPointsLedgerModule,
            vehicles_module_1.VehiclesModule,
            inventory_module_1.InventoryModule,
            sales_module_1.SalesModule,
            conversions_module_1.ConversionsModule,
            login_history_module_1.LoginHistoryModule,
            checkin_records_module_1.CheckinRecordsModule,
            leaves_module_1.LeavesModule,
            customer_cards_module_1.CustomerCardsModule,
            visibility_reports_module_1.VisibilityReportsModule,
            attendants_cash_hand_module_1.AttendantsCashHandModule,
            managers_cash_approvals_module_1.ManagersCashApprovalsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: global_auth_guard_1.GlobalAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map