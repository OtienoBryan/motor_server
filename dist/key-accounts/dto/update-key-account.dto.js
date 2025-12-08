"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateKeyAccountDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_key_account_dto_1 = require("./create-key-account.dto");
class UpdateKeyAccountDto extends (0, mapped_types_1.PartialType)(create_key_account_dto_1.CreateKeyAccountDto) {
}
exports.UpdateKeyAccountDto = UpdateKeyAccountDto;
//# sourceMappingURL=update-key-account.dto.js.map