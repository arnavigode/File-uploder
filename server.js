const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongodb = require ('mongodb')
const Path = require('path')
const app = express();

app.use(bodyParser.urlencoded({extended:true}))

var storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, 'uploads');
    },
    filename:function(req, file, cb){
        cb(null, file.fieldname + `-` + Date.now() + Path.extname(file.originalname))
    }
})

var upload = multer({
    storage:storage
})
const MongoClient = mongodb.MongoClient;
const myurl = 'mongodb://localhost:27017';

MongoClient.connect(myurl,{
    // useUnifiedTopology: true,
    // useNewUrlParse: true

}, (err, client)=> {
    if(err) {return console.log('error')};

    db = client.db('fileupload');

    app.listen(4000, () => {
        console.log("mongo running");
    })
})

app.get('/', (req, res)=>{
    res.sendFile(__dirname + `/index.html`);
})


app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    if(!file){
        const error = new Error("Please Upload File");
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(file)
})

app.post('/uploadmultipleFile', upload.array('myFiles', 10), (req, res, next) => {
    const files = req.files;
    if(!files){
        const error = new Error("Please Upload File");
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(files)
})



app.listen(3000, () => {
    console.log("server is running on 3k");
})