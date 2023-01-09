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

    const recruiterdata = myDb.collection('companies')

    const drivedata = myDb.collection('drives')

    app.post('/login',(req,res)  => {

        let objtosend = {
            reqcode: 200,
            username: "",
            usertype: ""
        }

        const loguser = {
            username: req.body.username,
            password: req.body.password
        }

        logindata.findOne(loguser, (err,result) => {
            if(err)
            {
                objtosend.reqcode = 404
                res.send(JSON.stringify(objtosend))
            }
            else
            {
                if(result !=null)
                {
                objtosend.username  = loguser.username
                objtosend.usertype =  result.usertype
                res.send(JSON.stringify(objtosend))
                }
                else
                {
                    objtosend.reqcode = 404
                    res.send(JSON.stringify(objtosend))
                }
            }
        })

    })

    app.post('/addstudent', (req, res) => {
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

        var query = { rollno: req.body.rollno }

        studentsdata.findOne(query, (err, result) => {

            if (result == null) 
            {
                studentsdata.insertOne(newUser, (err, result) => {

                    query = {username: loginuser.username}

                    logindata.findOne(query,(err,resultt) => { //
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
                            res.send(JSON.stringify({reqstatus: 404}))
                        }
                    })
                   
                })
            } else {
                res.send(JSON.stringify({reqstatus : 404}))
            }

        })

        console.log("received request for adding user")

    })

    app.post('/addrecruiter', (req, res) => {

        console.log("hi")

        const newrecuiter = {
            name: req.body.name,
            username: req.body.username,
            gst: req.body.gst,
            drive: req.body.drive,
            email:  req.body.email,
            lastDrive: req.body.lastDrive,
            status: req.body.status
        }

        const loginuser = {
            username: req.body.username,
            password: "amrita",
            usertype: "Recruiter"
        }

        var query = { name: req.body.name }

        recruiterdata.findOne(query, (err, result) => {

            if (result == null) 
            {
                recruiterdata.insertOne(newrecuiter, (err, result) => {

                    query = {username: loginuser.username}

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
                            res.send(JSON.stringify({reqstatus: 404}))
                        }
                    })
                   
                })
            } else {
                res.send(JSON.stringify({reqstatus : 404}))
            }

        })

        console.log("received request for adding user")

    })
    
    app.post('/getrecruiter', (req, res) => {

        console.log("hi recived request for getrecruiter")

        var returnval = {items: [],reqcode: 200}


        recruiterdata.find({}).toArray(function(err,items) {
            if(err) console.log(err)
            
            if(items.length != 0)
            {
                returnval.items = items
                res.send(JSON.stringify(returnval))
            }
            else
            {
                returnval.reqcode = 400
                res.send(JSON.stringify(returnval))
            }

            //console.log(items)
        })

    })

    app.post('/getstudent', (req, res) => {

        console.log("hi recived request for getstudent")

        var returnval = {items: [],reqcode: 200}


        studentsdata.find({}).toArray(function(err,items) {
            if(err) console.log(err)
            
            if(items.length != 0)
            {
                returnval.items = items
                res.send(JSON.stringify(returnval))
            }
            else
            {
                returnval.reqcode = 400
                res.send(JSON.stringify(returnval))
            }
        })

    })

    app.post('/getsinglestudent', (req, res) => {

        console.log("hi recived request for single getstudent")

        var returnval = {items: [],reqcode: 200}

        query = {
            rollno: req.body.username
        }

        studentsdata.findOne(query, function(err,items) {
            
            if(err)
            {
                returnval.reqcode = 400
                res.send(JSON.stringify(returnval))
            }
            else{
                returnval.items = items
                res.send(JSON.stringify(returnval))
            }
        })

    })

    app.post("/deletecompany", (req,res) => {
        console.log("Received a request to delete a company")

        userdetail = {
            username: req.body.username
        }

        recruiterdata.deleteOne(userdetail, (err,obj) => {
            if(err){
                res.send(JSON.stringify({reqcode: 404}))
                console.log(err)
            }
            res.send(JSON.stringify({reqcode: 200}))
        })

    })

    app.post("/deletestudent", (req,res) => {
        console.log("Received a request to delete a student")

        userdetail = {
            rollno: req.body.rollno
        }

        studentsdata.deleteOne(userdetail, (err,obj) => {
            if(err){
                res.send(JSON.stringify({reqcode: 404}))
                console.log(err)
            }
            res.send(JSON.stringify({reqcode: 200}))
        })

    })

    app.post("/updatecompany", (req,res) => {
        console.log("Received a request to update a company")

        userdetail = {
            username: req.body.username
        }

        updateduser = {
            name: req.body.name,
            username: req.body.username,
            gst: req.body.gst,
            drive: req.body.drive,
            email: req.body.email,
            lastDrive: req.body.lastDrive,
            status: req.body.status
        }

        var newvalues = {$set : updateduser}

        recruiterdata.updateOne(userdetail,newvalues, (err,obj) => {
            if(err){
                res.send(JSON.stringify({reqcode: 404}))
                console.log(err)
            }
            res.send(JSON.stringify({reqcode: 200}))
        })

    })

    app.post("/updatestudent", (req,res) => {
        console.log("Received a request to update a student")

        userdetail = {
            rollno: req.body.rollno
        }

        updateduser = {
            name: req.body.name,
            rollno: req.body.rollno,
            dob: req.body.dob,
            email: req.body.email,
            mobile: req.body.mobile,
            cgpa: req.body.cgpa,
            course: req.body.course,
            status: req.body.status
          }

        var newvalues = {$set : updateduser}

        studentsdata.updateOne(userdetail,newvalues, (err,obj) => {
            if(err){
                res.send(JSON.stringify({reqcode: 404}))
                console.log(err)
            }
            res.send(JSON.stringify({reqcode: 200}))
        })

    })

    app.post("/adddrive", (req,res) => {
        console.log("Received a request to add a drive")

        objToSend = {reqcode: 200}

        let newdrive = {
            jobDesignation: req.body.jobDesignation,
            tenthPercentage: req.body.tenthPercentage,
            jobDescription: req.body.jobDescription,
            twlethPercentage: req.body.twlethPercentage,
            course: req.body.course,
            deptSelected: req.body.deptSelected,
            mincgpa: req.body.mincgpa,
            events: req.body.events,
            salary: req.body.salary,
            bondDetails: req.body.bondDetails,
            addReq: req.body.addReq,
            addDes: req.body.addDes,
            company_name: req.body.company_name,
            closingDate: req.body.closingDate,
            openingDate: req.body.openingDate,
          };
        
          drivedata.insertOne(newdrive,(error,resu) => {
            if(error)
            {
                objToSend.reqcode = 404
            res.send(JSON.stringify(objToSend))
            }
            else
            res.send(JSON.stringify(objToSend))
        })
    })

    app.post("/recruiterpassword", (req,res) => {
        console.log("Received a request to update a recruiter password")

        userdetail = {
            username: req.body.username,
            newpassword: req.body.newpassword
        }

        values = {password: userdetail.newpassword}

        var newvalues = {$set : values}

        let query = {username: userdetail.username}

        logindata.updateOne(query,newvalues, (err,obj) => {
            if(err){
                res.send(JSON.stringify({reqcode: 404}))
                console.log(err)
            }
            else
            res.send(JSON.stringify({reqcode: 200}))
        })
    })

    app.post("/adminpassword", (req,res) => {
        console.log("Received a request to update a recruiter password")

        userdetail = {
            username: req.body.username,
            newpassword: req.body.newpassword
        }

        values = {password: userdetail.newpassword}

        var newvalues = {$set : values}

        let query = {username: userdetail.username}

        logindata.updateOne(query,newvalues, (err,obj) => {
            if(err){
                res.send(JSON.stringify({reqcode: 404}))
                console.log(err)
            }
            else
            res.send(JSON.stringify({reqcode: 200}))
        })
    })


    app.post('/getdrive', (req, res) => {

        console.log("hi recived request for getdrive")

        var returnval = {items: [],reqcode: 200}


        drivedata.find({}).toArray(function(err,items) {
            if(err) console.log(err)
            
            if(items.length != 0)
            {
                let userdata = {}

                let array = []

                for(let i =0;i<items.length;i++)
                {
                    //console.log(item)
                    userdata.name = items[i].company_name
                    userdata.open = items[i].openingDate
                    userdata.close = items[i].closingDate
                    userdata.designation = items[i].jobDesignation
                    userdata.regStud = "180",
                    userdata.cgpa = items[i].mincgpa,
                    userdata.course = "B.tech"
                    userdata.status = "Open"
                    array.push(userdata)
                }

                returnval.items = array
                res.send(JSON.stringify(returnval))
            }
            else
            {
                returnval.reqcode = 400
                res.send(JSON.stringify(returnval))
            }
        })

    })


})


app.listen(3000, () => {
    console.log("Listening on port 3000...")
})