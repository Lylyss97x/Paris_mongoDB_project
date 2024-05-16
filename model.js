import { Schema, model } from "mongoose";


const schemaBalade = new Schema({

    identifiant : String,
    adresse : { type : String, required : true },
    code_postal : String,
    parcours : {
        0 : String
    },

    url_image : String,
    copyright_image : Schema.Types.Mixed,
    legende : Schema.Types.Mixed,
    categorie : { type : String, required : true },
    nom_poi : { type : String, required : true },
    date_saisie : String,
    mot_cle : Array,
    ville : String,
    texte_intro : String,
    texte_description : String,
    url_site : Schema.Types.Mixed,
    fichier_image : {
        thumbnail : Boolean,
        filename : String,
        format : String,
        width : Number,
        mimetype : String,
        etag : String,
        id : String,
        last_synchronized  : String,
        color_summary  : Array,
        height : Number
        
    },
    geo_shape: {
        type: { type: String },
        geometry: {
            coordinates: [Number],
            type: { type: String }
        },
        properties: {}
    },
    geo_point_2d: {
        lon: Number,
        lat: Number
    }

    })

    const Balade = model("balades", schemaBalade)
    export { Balade };


const schemaVehicule = new Schema({
    model : String,
    proprietaire : { 
        prenom : String,
        nom : String
    },
    annee : Number,
    enCirculation : Boolean,

})

const schemaExo = new Schema({
    titre : String, 
    note : Number,
    sommaire : Array,
    auteur : {
        nom : String, 
        titre : String
    }
})

const Vehicule = model("vehicules", schemaVehicule)
const Exo = model("exos", schemaExo)
//premier param est le nom de la collection

export { Vehicule };

export {Exo};
