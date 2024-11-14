"use strict";

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define(
        "Category",
        {
            category_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            category_parent_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            category_name: {
                type: DataTypes.STRING(225),
                allowNull: false,
            },
            is_hidden: {
                type: DataTypes.TINYINT(1),
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            tableName: "category",
            timestamps: false,
        }
    );

    Category.associate = function (models) {
        Category.hasMany(models.Product, { foreignKey: 'category_id' });
    };

    return Category;
};
