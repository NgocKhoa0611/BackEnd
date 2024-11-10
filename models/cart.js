"use strict";

module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define(
        "Cart",
        {
            cart_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "cart",
            timestamps: false,
        }
    );

    Cart.associate = (models) => {
        Cart.belongsTo(models.User, { foreignKey: 'user_id' });
        Cart.hasMany(models.CartDetail, { foreignKey: 'cart_id', as: 'cartDetail' });
    };

    return Cart;
};
