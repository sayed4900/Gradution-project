const predictRoutes = require('./routes/prdictRoutes')
const express = require('express') ; 
const cors = require('cors')
const app = express() ; 


app.use(express.json()) ; 

app.use(cors()) ; 

app.use('/',predictRoutes) ; 

const port = 5000 ; 
app.listen(port,()=>{console.log(`Server is running on port ${port}`)}) ;
