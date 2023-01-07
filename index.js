const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient

const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

const url = "mongodb+srv://placementNcp:Narikootam123@cluster0.xxmqluh.mongodb.net/?retryWrites=true&w=majority"

app.use(express.json())

MongoClient.connect(url,(err,db) => {
    if(err)
    {
        console.log(err);
        return;
    }

    console.log("Ready")

    var myDb = db.db("placementportal");

    const logindata = myDb.collection('user')

    const studentsdata = myDb.collection('students')

    app.post('/addstudent', (req, res) => {

        console.log("hi")

        const newUser = {
            rollno: req.body.rollno,
            name: req.body.name,
            dob: req.body.dob,
            email: req.body.email,
            mobile: req.body.mobile,
            cgpa: req.body.cgpa,
            course: req.body.course,
            status: req.body.status
        }

        const loginuser = {
            username: req.body.rollno,
            password: "amrita",
            usertype: "Student"
        }

        const query = { rollno: req.body.rollno }

        studentsdata.findOne(query, (err, result) => {

            if (result == null) 
            {
                studentsdata.insertOne(newUser, (err, result) => {

                    logindata.insertOne(loginuser,(error,res) => {

                        const objToSend = {
                            username: res.username,
                            usertype: res.usertype
                        }
    
                        res.status(200).send(JSON.stringify(objToSend))
                    })

                    res.status(400).send()
                   
                })
            } else {
                res.status(400).send()
            }

        })

        console.log("received request for adding user")

    })

        app.post('/login', (req, res) => {

            const query = {
                username: req.body.username, 
                password: req.body.password,
                usertype: req.body.usertype
            }

            collection.findOne(query, (err, result) => {

                if (result != null) {

                    const objToSend = {
                        username: result.username,
                        usertype: result.usertype
                    }

                    res.status(200).send(JSON.stringify(objToSend))

                } else {
                    res.status(404).send()
                }

            })
            console.log("received login")
        })

})


app.listen(3000, () => {
    console.log("Listening on port 3000...")
})