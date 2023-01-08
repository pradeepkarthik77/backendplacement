const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient

const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors());

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

                    logindata.findOne(query,(err,resultt) => {

                        if(resultt == null)
                        {
                            logindata.insertOne(loginuser,(error,resu) => {
                                const objToSend = {
                                    username: loginuser.username,
                                    usertype: loginuser.usertype,
                                    reqstatus: 200
                                    }
                                    res.send(JSON.stringify(objToSend))
                            })
                        }
                        else{
                            res.send(JSON.stringify({reqstatus: 404,inda:100}))
                        }
                    })
                   
                })
            } else {
                res.send(JSON.stringify({reqstatus : 404,souh:200}))
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