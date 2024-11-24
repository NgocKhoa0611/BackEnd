"use strict";

module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define(
        "OrderDetail",
        {
            order_detail_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            total_amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            orders_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "orders",
                    key: "orders_id",
                },
            },
            product_detail_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "product_detail",
                    key: "product_detail_id",
                },
            },
        },
        {
            tableName: "orders_detail",
            timestamps: false,
        }
    );

    OrderDetail.associate = (models) => {
        OrderDetail.belongsTo(models.Order, { foreignKey: "orders_id", as: "order" }); // Liên kết với bảng Orders
        OrderDetail.belongsTo(models.ProductDetail, { foreignKey: "product_detail_id", as: "productDetail" }); // Liên kết với bảng ProductDetails
    };

    return OrderDetail;
};
