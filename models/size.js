"use strict";

module.exports = (sequelize, DataTypes) => {
    const Size = sequelize.define(
        "Size",
        {
            size_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            size_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
        },
        {
            tableName: "size",
            timestamps: false,
        }
    );

    Size.associate = function (models) {
        Size.hasMany(models.ProductDetail, { foreignKey: 'size_id' });
    };

    return Size;
};
