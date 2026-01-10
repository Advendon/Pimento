"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategory = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["DRAFT"] = "draft";
    OrderStatus["QUOTED"] = "quoted";
    OrderStatus["APPROVED"] = "approved";
    OrderStatus["IN_PROGRESS"] = "in_progress";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["BUSINESS_CARDS"] = "business_cards";
    ProductCategory["FLYERS"] = "flyers";
    ProductCategory["BROCHURES"] = "brochures";
    ProductCategory["POSTERS"] = "posters";
    ProductCategory["LABELS"] = "labels";
    ProductCategory["PACKAGING"] = "packaging";
    ProductCategory["STATIONERY"] = "stationery";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
//# sourceMappingURL=index.js.map