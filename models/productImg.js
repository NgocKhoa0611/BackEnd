"use strict";

module.exports = (sequelize, DataTypes) => {
    const ProductImage = sequelize.define(
        "ProductImage",
        {
            product_image_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            img_url: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            is_primary: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0,
            },
            product_detail_id: {
                type: DataTypes.INTEGER,
                allowNull: true, // Change to false if required
            },
        },
        {
            tableName: 'product_image',
            timestamps: false,
        }
    );

    ProductImage.associate = function (models) {
        ProductImage.belongsTo(models.ProductDetail, {
            foreignKey: "product_detail_id",
            as: 'detail'
        });
    };

    return ProductImage;
};



