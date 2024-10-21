"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
        }
    }
    Product.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            product_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            stock_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            is_featured: {
                type: DataTypes.TINYINT(1),
                allowNull: true,
                defaultValue: 0,
            },
            create_at: {
                type: DataTypes.TIMESTAMP,
                allowNull: true,
            },
            update_at: {
                type: DataTypes.TIMESTAMP,
                allowNull: true,
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Product",
            tableName: "product",
            timestamps: false,
        }
    );
    return Product;
};
