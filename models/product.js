"use strict";

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define(
        "Product",
        {
            product_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            product_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            price_promotion: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "categories",
                    key: "category_id",
                },
            },
        },
        {
            tableName: "product",
            timestamps: false,
        }
    );

    Product.associate = function (models) {
        Product.belongsTo(models.Category, {
            foreignKey: "category_id",
            as: "category",
        });
        Product.hasMany(models.ProductDetail, {
            foreignKey: "product_id",
            as: "detail",
        });
    };

    return Product;
};
