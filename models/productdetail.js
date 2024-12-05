"use strict";

module.exports = (sequelize, DataTypes) => {
    const ProductDetail = sequelize.define(
        "ProductDetail",
        {
            product_detail_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            color_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            size_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Product",
                    key: "product_id",
                },
            },
            is_primary: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 1,
            },
            isFeatured: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isHot: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
        },
        {
            tableName: "product_detail",
            timestamps: false,
        }
    );

    ProductDetail.associate = function (models) {
        ProductDetail.belongsTo(models.Product, {
            foreignKey: "product_id",
            as: "product",
        });
        ProductDetail.belongsTo(models.Color, {
            foreignKey: "color_id",
            as: "color",
        });
        ProductDetail.belongsTo(models.Size, {
            foreignKey: "size_id",
            as: "size",
        });
        ProductDetail.hasOne(models.ProductImage, {
            foreignKey: "product_detail_id",
            as: "productImage",
        });

        // Liên kết với bảng Review
        ProductDetail.hasMany(models.Review, {
            foreignKey: "product_detail_id",
            as: "reviews",
        });
    };

    return ProductDetail;
};
