"use strict";

module.exports = (sequelize, DataTypes) => {
    const CartDetail = sequelize.define(
        "CartDetail",
        {
            cart_detail_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            cart_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            product_detail_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
        },
        {
            tableName: "cart_detail",
            timestamps: false,
        }
    );

    CartDetail.associate = (models) => {
        CartDetail.belongsTo(models.Cart, { foreignKey: 'cart_id' });
        CartDetail.belongsTo(models.ProductDetail, { foreignKey: 'product_detail_id' });
    };

    return CartDetail;
};
