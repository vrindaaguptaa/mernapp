
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const mongoDB=require('./db')
mongoDB();
app.use((req,res,next) =>{
  res.setHeader("process.env.FRONTEND_URL","http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
})
app.use(express.json());
app.use('/api', require("./Routes/CreateUser"));
app.use('/api', require("./Routes/DisplayData"));
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
module.exports = app;