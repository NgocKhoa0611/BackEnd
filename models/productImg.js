"use strict";

module.exports = (sequelize, DataTypes) => {
    const ProductImage = sequelize.define(
        'ProductImage',
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
        }, {
        tableName: 'product_image',
        timestamps: false,
    });

    ProductImage.associate = function (models) {
        ProductImage.hasMany(models.ProductDetail, {
            foreignKey: "product_image_id",
        });
    }

    return ProductImage;
}



