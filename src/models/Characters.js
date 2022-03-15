const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('characters', {
/*     id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    }, */
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image:{
        type:DataTypes.STRING,
        allowNull: true,
    },
    age:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    weight:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    story:{
        type:DataTypes.TEXT,
        allowNull:false,
    }  
  },
  {
    timestamps: false
  }
);
};
