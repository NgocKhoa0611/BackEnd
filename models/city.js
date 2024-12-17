"use strict";

module.exports = (sequelize, DataTypes) => {
    const City = sequelize.define(
        "City",
        {
            city_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            city_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            shipping_fee: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "city",
            timestamps: false,
        }
    );

    City.associate = (models) => {
        // Quan hệ với bảng Order
        City.hasMany(models.Order, { foreignKey: "city_id", as: "orders" });
    };

    return City;
};
