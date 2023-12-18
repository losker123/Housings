const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING, unique: false},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Owner = sequelize.define('owner',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Housing = sequelize.define('housing',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const Coordinates = sequelize.define('coordinates',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    lat: {type: DataTypes.FLOAT, allowNull: false},
    lng: {type: DataTypes.FLOAT, allowNull: false}
})

const Category = sequelize.define('category',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Grade = sequelize.define('grade',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type: DataTypes.INTEGER, allowNull: false},
})


const Rental = sequelize.define('rental', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    housingId: {type: DataTypes.INTEGER, allowNull: false},
    startDate: {type: DataTypes.DATE, allowNull: false},
    endDate: {type: DataTypes.DATE, allowNull: false},
});

const Review = sequelize.define('review', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    housingId: {type: DataTypes.INTEGER, allowNull: false},
    rating: {type: DataTypes.INTEGER, allowNull: false},
    comment: {type: DataTypes.STRING, allowNull: true}
});

Housing.hasOne(Owner);
Owner.belongsTo(Housing);

Housing.hasOne(Coordinates);
Coordinates.belongsTo(Housing);

Category.hasMany(Housing);
Housing.belongsTo(Category);

Housing.hasMany(Grade);
Grade.belongsTo(Housing);

User.hasMany(Rental);
Rental.belongsTo(User);

User.hasMany(Owner);
Owner.belongsTo(User);

Housing.hasMany(Rental);
Rental.belongsTo(Housing);

User.hasMany(Review);
Review.belongsTo(User);

Housing.hasMany(Review);
Review.belongsTo(Housing);

module.exports = {
    User,
    Housing,
    Coordinates,
    Category,
    Grade,
    Rental,
    Review,
    Owner,
};
