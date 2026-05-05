const express = require('express');
const cors = require('cors');
const app = express();
const salesRoutes = require('./routes/sales');

app.use(express.json());
app.use(cors());

app.use('/sales', salesRoutes);

app.get('/', (req, res)=>{
    res.send('Sales API rodando')
})

app.listen(3000, ()=>{
    console.log('Sales API rodando na porta 3000');
})