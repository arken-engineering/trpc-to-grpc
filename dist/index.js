"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingMiddleware = exports.packageMiddleware = exports.t = exports.customTransformer = exports.appRouter = void 0;
var basic_1 = require("./examples/basic");
Object.defineProperty(exports, "appRouter", { enumerable: true, get: function () { return basic_1.appRouter; } });
var transformer_1 = require("./transformer");
Object.defineProperty(exports, "customTransformer", { enumerable: true, get: function () { return transformer_1.customTransformer; } });
var packageMiddleware_1 = require("./middleware/packageMiddleware");
Object.defineProperty(exports, "t", { enumerable: true, get: function () { return packageMiddleware_1.t; } });
Object.defineProperty(exports, "packageMiddleware", { enumerable: true, get: function () { return packageMiddleware_1.packageMiddleware; } });
Object.defineProperty(exports, "loggingMiddleware", { enumerable: true, get: function () { return packageMiddleware_1.loggingMiddleware; } });
//# sourceMappingURL=index.js.map