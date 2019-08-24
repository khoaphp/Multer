var express = require("express");
var app = express();

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("avatar");


app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.listen(3000);

app.get("/", function(req, res){
    res.render("trangchu"); // enctype="multipart/form-data"
});

app.post("/xuly",  function(req, res){

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log("A Multer error occurred when uploading."); 
        } else if (err) {
          console.log("An unknown error occurred when uploading." + err);
        }else{
            console.log("Upload is okay");
            console.log(req.file); // Thông tin file đã upload
            if(req.body.txtUn && req.body.txtPa){
                var un = req.body.txtUn;
                var pa = req.body.txtPa;
                res.json({"username":un, "password": pa, "file": req.file.filename});
            }else{
                res.json({"result":0});
            }
        }

    });
});
