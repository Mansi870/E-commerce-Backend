const express = require("express");
const Sequelize = require("sequelize");
const db = require("./db.config");
const ProductData = require("./productData");
const loginData = require("./LoginData");
const cors = require("cors");
var nodemailer = require('nodemailer');

var app = express();
app.use(cors());

const sequelize = new Sequelize(db.DB, db.USER, db.PASSWORD, {
    host: db.HOST,
    dialect: db.dialect,
    pool: {
        min: db.pool.min,
        max: db.pool.max,
        aquire: db.pool.aquire,
        idle: db.pool.idle,
    },
});
// sequelize
//     .authenticate()
//     .then(() => {
//         console.log("Successfully connected with database....");
//     })
//     .catch((err) => {
//         console.log("Unable to connect with the database,:" + err);
//     });

let productTable = sequelize.define(
    "productTable", {
        id: {
            primaryKey: true,

            type: Sequelize.INTEGER,
        },
        title: Sequelize.STRING,
        // price: Sequelize.STRING,
        price: Sequelize.INTEGER,
        description: Sequelize.STRING(800),
        category: Sequelize.STRING,
        image: Sequelize.STRING,
        rate: Sequelize.FLOAT,
        count: Sequelize.INTEGER,
    }, {
        timestamps: false,
        freezeTableName: true,
    }
);
productTable
    .sync()
    .then(() => {
        console.log("Table is created successfully..");
    })
    .catch((err) => {
        console.log("Unable to create table...");
    });

// insert records in table in bulk
// productTable
//     .bulkCreate(ProductData)
//     .then(() => {
//         console.log("Data Inserted into table successfully..");
//     })
//     .catch((err) => {
//         console.log("error in inserting.." + err);
//     });

app.get("/getAllProducts", (req, res) => {
    productTable
        .findAll({ raw: true })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log("Error in fetching details from table....");
            res.status(400).send("Error in fetching details from table....");
        });
});

let LoginData = sequelize.define(
    "LoginData", {
        id: {
            primaryKey: true,

            type: Sequelize.INTEGER,
        },
        Email: Sequelize.STRING,
        Password: Sequelize.STRING,
        ConfPassword: Sequelize.STRING,
        Phone: Sequelize.STRING,
    }, {
        timestamps: false,
        freezeTableName: true,
    }
);
LoginData.sync()
    .then(() => {
        console.log("Table is created successfully..");
    })
    .catch((err) => {
        console.log("Unable to create table...");
    });

// insert records in table in bulk
// LoginData.bulkCreate(loginData)
//     .then(() => {
//         console.log("Data Inserted into table successfully..");
//     })
//     .catch((err) => {
//         console.log("error in inserting.." + err);
//     });

app.get("/getAllData", (req, res) => {
    LoginData.findAll({ raw: true })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log("Error in fetching details from table....");
            res.status(400).send("Error in fetching details from table....");
        });
});
app.use(express.json());
// app.post("/login", (req, res) => {
//     email = req.body.Email;
//     pass = req.body.Password;
//     LoginData.findAll({ where: { email: Email }, raw: true })
//         .then((data) => {
//             if (data.length > 0 && data[0].Email == req.body.Email) {
//                 console.log("Valid User");
//                 res.status(200).send("User is verified..");
//             } else {
//                 res.send("Invalid User");
//             }
//         })
//         .catch((err) => {
//             console.log("getting error");
//             res.status(400).send("Invalid User");
//         });
// });

//Register

app.post("/register", (req, res) => {
    Id=req.body.id;
    email = req.body.Email;
    pass = req.body.Password;
    confPass = req.body.ConfPassword;
    phone = req.body.Phone;

    let userObj = LoginData.build({
        id:Id,
        Email: email,
        Password: pass,
        ConfPassword: confPass,
        Phone: phone,
    });

    userObj.save()
        .then((data) => {
            strData = "User is successfully Registered...";
            console.log(strData);
            res.status(201).send("User is successfully Registered...");
        })
        .catch((err) => {
            console.log("Error in inserting the record.." + err);
            res.status(400).send("Invalid User");
        });
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mansimalik870@gmail.com',
      pass: 'oaftkyoteobseark'
    }
  });
  
  var mailOptions = {
    from: 'mansimalik870@gmail.com',
    to: 'mansimalik269@gmail.com',
    subject: 'Congratulations! Order Placed',
    text: 'Your Order has been placed Successfully. '
  };

let OrderTable = sequelize.define(
    "OrderTable", {
        id: {
            primaryKey: true,

            type: Sequelize.INTEGER,
        },
        title: Sequelize.STRING,
        image: Sequelize.STRING,
      
        price: Sequelize.INTEGER,
        OrderDate:Sequelize.STRING,
        DeliveryDate:Sequelize.STRING

    }, {
        timestamps: false,
        freezeTableName: true,
    }
);
OrderTable.sync()
    .then(() => {
        console.log("Table is created successfully..");
    })
    .catch((err) => {
        console.log("Unable to create table...");
    });

   

    app.post("/orderPlaced", (req, res) => {

        OrderTable.bulkCreate(req.body).then((data)=>{
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }

                console.log(req.body);
              });
            
            res.status(201).send("Insert successfully");
        }).catch((err)=>{
            console.log(err)
            res.status(400).send("Error" +err);
        })
        
    });

    app.get("/AllOrders",(req,res)=>{
        OrderTable.findAll({ raw: true })
            .then((data) => {
                res.status(202).send(data);
            })
            .catch((err) => {
                console.log("Error while fetching records from table..." + err);
            });
    })
app.listen(8000, function() {
    console.log("Server is listening at http://localhost:8000");
});