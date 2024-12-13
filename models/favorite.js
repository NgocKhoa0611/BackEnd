"use strict";

module.exports = (sequelize, DataTypes) => {
    const Favorite = sequelize.define(
        "Favorite",
        {
            favorite_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "user", // Tên bảng liên kết
                    key: "user_id",
                },
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "product", // Tên bảng liên kết
                    key: "product_id",
                },
            },
        },
        {
            tableName: "favorite",
            timestamps: false,
        }
    );

    Favorite.associate = function (models) {
        Favorite.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });
        Favorite.belongsTo(models.Product, {
            foreignKey: "product_id",
            as: "product",
        });
    };

    return Favorite;
};
