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
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "products",
                    key: "product_id",
                },
            },
            product_image_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "product_images",
                    key: "product_image_id",
                },
            },
            is_featured: {
                type: DataTypes.TINYINT,
                allowNull: true,
                defaultValue: 0,
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
        ProductDetail.belongsTo(models.ProductImage, {
            foreignKey: "product_image_id",
            as: "productImage",
        });
    };

    return ProductDetail;
};
