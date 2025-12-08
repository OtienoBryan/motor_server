"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFuelPriceDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_fuel_price_dto_1 = require("./create-fuel-price.dto");
class UpdateFuelPriceDto extends (0, mapped_types_1.PartialType)(create_fuel_price_dto_1.CreateFuelPriceDto) {
}
exports.UpdateFuelPriceDto = UpdateFuelPriceDto;
//# sourceMappingURL=update-fuel-price.dto.js.map