import pkg from 'sequelize'
const { Sequelize, DataTypes } = pkg;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './msiregistrar2_db.sqlite'
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
    remember_created_at:DataTypes.DATE(6),
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
    remember_me:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    freezeTableName: true
  })

const Project = sequelize.define('project',{
    name: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: false
    },
    //user_id: {
    //    type: DataTypes.INTEGER,
    //    allowNull: false
    //},
    normalization: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    pixel_size_x: {
        type: DataTypes.INTEGER,
    },
    pixel_size_y: {
        type: DataTypes.INTEGER,
    },
    
}, {
    freezeTableName: true
  })

const HistologyImage = sequelize.define('histologyImage',{
    //project_id:{
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

const MSIdata = sequelize.define('msidata',{
    /*project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },*/
    data_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'imzML',
        validate:{
            isIn: [['imzML', 'Analyze_7.5']]
        }
    },
    imzml_file: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ibd_file: {
        type: DataTypes.STRING,
        allowNull: false
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
    },
    min_mz:DataTypes.FLOAT,
    max_mz:DataTypes.FLOAT,
    mz_interval:DataTypes.FLOAT,
    msi_h:DataTypes.INTEGER,
    msi_w:DataTypes.INTEGER,
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
    }
}, {
    freezeTableName: true
  })

const Registration = sequelize.define('registration',{
    /*project_id: {
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
            isIn: [['created', 'waiting', 'running', 'finished']]
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
    transformmatrix_file: {
        type: DataTypes.STRING,
    },
    registered_index_file: {
        type: DataTypes.STRING
    }
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
    min_mz:{
        type: DataTypes.FLOAT
    },
    max_mz:{
        type: DataTypes.FLOAT
    },
    mz_interval:{
        type: DataTypes.FLOAT
    },
    extract_file:{
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'created',
        validate: {
            isIn: [['created', 'waiting', 'running', 'finished']]
        }
    },
}, {
    freezeTableName: true
  })

Project.belongsTo(User)
HistologyImage.belongsTo(Project)
MSIdata.belongsTo(Project)
HistologyROI.belongsTo(HistologyROI)
Project.hasMany(Registration)
Project.hasMany(Extraction)
HistologyImage.hasMany(Registration)
MSIdata.hasMany(Registration)
HistologyROI.hasMany(Registration)
MSIdata.hasMany(Extraction)
HistologyROI.hasMany(Extraction)


export {User, Project, Registration, Extraction, HistologyImage, HistologyROI, MSIdata}