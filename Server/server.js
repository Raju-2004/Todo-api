require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 4000


app.get('/',(req,res)=>{
    res.send("HII");
})

app.listen(port,()=>{
    console.log(`Server is listening at http://localhost:${port}`);
})
