import express from "express"
import router from "./root.js"

import {connect} from "mongoose"

connect("mongodb+srv://alyssapaygambar:azerty***@cluster0.hv3cd61.mongodb.net/Paris")
.then(function(){
    console.log("connexion mongo réussi")
})
.catch(function(err){
    console.log(new Error(err))
})

async function connexion(){
    await connect
}

const app = express();
const PORT = 1235;

app.use(express.json()); // permet au serveur d'accepter les requêtes ajax qui envoie du JSON

app.use(router)

app.listen(PORT, function(){
    console.log (`server express running on ${PORT}`)
})