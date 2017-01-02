var express = require('express');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var app = express();

//add (index) to the file if already exists
function name_change(filen,index){

	var exists = fs.existsSync(__dirname+'/upload/'+filen+'('+index+')');
		
		if(!exists) {
			filen=path.basename(filen)+'('+index+')';
		}else{
			filen=name_change(filen,index+1);
		}

	return filen;
}
//setting the upload directory + change name of file if it already exists
var storage = multer.diskStorage(
	{
		destination:'./upload/',
		filename: function(req, file, callback){
		
			var fn=file.originalname;
			var exists = fs.existsSync(__dirname+'/upload/'+file.originalname);
				if(!exists) {
					fn = file.originalname;
				
				}else{
					fn=name_change(file.originalname,1);
					console.log(fn);
				}	
			
		
		
			callback(null,fn);
		}
	}

);
//initialise multer module
var upload_file = multer({storage:storage});

//define the route of /
app.get('/',function(req,res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});

//send file to upload and send message to the user.
app.post('/upload',upload_file.single('fileupload'),function(req,res){
res.end(req.file.filename+' was succesfully uploaded!');

});

//if path is not available
app.use(function(req,res,next) {
	res.status(404).send("NOPE!");
});

app.listen(8080);