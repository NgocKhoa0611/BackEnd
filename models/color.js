"use strict";

module.exports = (sequelize, DataTypes) => {
    const Color = sequelize.define(
        "Color",
        {
            color_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            color_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
        },
        {
            tableName: "color",
            timestamps: false,
        }
    );

    Color.associate = function (models) {
        Color.hasMany(models.ProductDetail, { foreignKey: 'color_id' });
    };

    return Color;
};
