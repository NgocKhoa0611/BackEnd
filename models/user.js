"use strict";

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            user_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            avatar: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            registration_date: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "users",
            timestamps: false,
        }
    );
    return User;
};
