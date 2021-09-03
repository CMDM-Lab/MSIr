import pkg from 'sequelize'
const { Sequelize, DataTypes } = pkg;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './msiregistrar2_db.sqlite',
    define: {
        freezeTableName: true
      }
  })

const User = sequelize.define('user',{
    api:DataTypes.STRING,
    key:DataTypes.STRING,
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
        unique: true,
        validate:{
            isEmail: true,
        }
    },
    encrypted_password:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    reset_password_token:{
        type: DataTypes.STRING,
        unique: true
    },
    reset_password_sent_at:DataTypes.DATE(6),
    role:{
        type: DataTypes.STRING,
        validate:{
            isIn: [['admin', 'guest', 'user']]
        }
    },
    guest:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    token:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
}, {
    freezeTableName: true
  })

const Dataset = sequelize.define('dataset',{
    name: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: false
    },
    description: DataTypes.STRING,
    //user_id: {
    //    type: DataTypes.INTEGER,
    //    allowNull: false
    //},
}, {
    freezeTableName: true
  })

const HistologyImage = sequelize.define('histologyImage',{
    //dataset_id:{
    //    type: DataTypes.INTEGER,
    //    allowNull: false,
    //},
    file: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    freezeTableName: true
  })

const MSI = sequelize.define('msi',{
    /*dataset_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },*/
    imzml_file: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ibd_file: {
        type: DataTypes.STRING,
        allowNull: false
    },
    /*data_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'imzML',
        validate:{
            isIn: [['imzML', 'Analyze_7.5']]
        }
    },
    hdr_file: {
        type: DataTypes.STRING,
        //allowNull: false
    },
    img_file: {
        type: DataTypes.STRING,
        //allowNull: false
    },
    t2m_file: {
        type: DataTypes.STRING,
        //allowNull: false
    },*/
    min_mz:DataTypes.FLOAT,
    max_mz:DataTypes.FLOAT,
    bin_size: {
        type: DataTypes.FLOAT,
        defaultValue: 0.01,
        allowNull: false
    },
    msi_h:DataTypes.INTEGER,
    msi_w:DataTypes.INTEGER,
    pixel_size: DataTypes.INTEGER,
    processed_data_file: {
        type: DataTypes.STRING,
    }
}, {
    freezeTableName: true
  })

const HistologyROI = sequelize.define('histologyroi',{
    /*histologyimage_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },*/
    label: {
        type: DataTypes.STRING,
        defaultValue: 'mask',
    },
    roi_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'mask',
        validate: {
            isIn: [['mask', 'ROI']]
        }
    },
    points: {
        type: DataTypes.JSON,
        allowNull: false
    },
    blend_img_file: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
  })

const Registration = sequelize.define('registration',{
    /*dataset_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    histologyimage_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    histologymask_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    msidata: {
        type: DataTypes.INTEGER,
        allowNull: false
    },*/
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'created',
        validate: {
            isIn: [['created', 'waiting', 'running', 'finished', 'error']]
        }
    },
    perform_type:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'intensity',
        validate: {
            isIn: [['intensity', 'contour']]
        }
    },
    transform_type:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'affine',
        validate: {
            isIn: [['affine', 'b-spline']]
        }
    },
    transform_matrix_file: {
        type: DataTypes.STRING,
    },
    result_file: {
        type: DataTypes.STRING, 
    }
    /*registered_index_file: {
        type: DataTypes.STRING
    }*/
})

const Extraction = sequelize.define('extraction',{
    /*msidata_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    histologyroi_id: {
        type: DataTypes.INTEGER,
        //allowNull: false
    },*/
    normalization: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    extract_file:{
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'created',
        validate: {
            isIn: [['created', 'waiting', 'running', 'finished', 'error']]
        }
    },
}, {
    freezeTableName: true
  })

Dataset.belongsTo(User)
HistologyImage.belongsTo(User)
MSI.belongsTo(User)
HistologyROI.belongsTo(User)
Registration.belongsTo(User)
Extraction.belongsTo(User)
HistologyImage.belongsTo(Dataset)
MSI.belongsTo(Dataset)
//HistologyImage.hasOne(Dataset)
//MSI.hasOne(Dataset)
HistologyROI.belongsTo(HistologyImage)
Dataset.hasMany(Registration)
Dataset.hasMany(Extraction)
HistologyImage.hasMany(Registration)
MSI.hasMany(Registration)
MSI.hasMany(Extraction)
HistologyROI.hasMany(Extraction)
Registration.hasMany(Extraction)


export {User, Dataset, Registration, Extraction, HistologyImage, HistologyROI, MSI}
export default sequelize