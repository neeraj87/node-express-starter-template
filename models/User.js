module.exports = (sequelize, type) => {
    return sequelize.define(
        'users', 
        {
            uuid: {
                type: type.STRING,
                primaryKey: true,
                autoIncrement: false
            },
            first_name: type.STRING,
            last_name: type.STRING,
            email: type.STRING,
            mobile: type.STRING,
            password: type.STRING
        },
        {
            timestamps: false,
            underscored: true
        }
    );
};