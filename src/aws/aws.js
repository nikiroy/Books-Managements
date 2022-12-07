const AWS = require("aws-sdk")

AWS.config.update({
   accessKeyId:"AKIAY3L35MCRZNIRGT6N",
secretAccessKey:"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",
region:"ap-south-1"

})

let uploadFile=async (file) =>{
    return new Promise(function (resolve,reject){
        let s3=new AWS.S3({apiVersion: '2006-03-01'})

        var uploadParams={
            ACL : "public-read",
            Bucket:"classroom-training-bucket",
            Key: "Nikita-bookCover/" + file.originalname,
            Body: file.buffer

    }
    s3.upload(uploadParams, function(err,data){
        if(err){
            return reject({"error": err})

        }
        console.log(data)
        console.log("file uploaded Successfully")
        return resolve(data.Location)
    })
    })
}
 const awsFunction=async function(req,res){
    try{
        let files=req.files
        if(files && files.length>0){
            let uploadFileURL=await uploadFile(files[0])
            res.status(201).send({message:"File uploaded succesfully", data:uploadFileURL})
        }
        else{
            res.status(400).send({message:"No file found"})
        }
    }
    catch(err){
        return res.status(500).send({error:err})
    }
}
module.exports.awsFunction=awsFunction

