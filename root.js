import { Router } from "express"
import {Vehicule} from "./model.js";
import {Exo} from "./model.js"
import { Balade } from "./model.js";
import { isValidObjectId } from "mongoose";

const router = Router()

router.get("/", function(req, rep){
    rep.json("bonjour");
})

router.get ("/all", async function(req, rep){
    const reponse = await Balade.find({});
    rep.json(reponse)
})

router.get ("/id/:id", async function(req, rep){

    const id = req.params.id
    const verif = isValidObjectId(id);

    if (!verif){
        return rep.status(400).json({msg : 'id invalid'});

    }

    const reponse = await Balade.findById(id)
    rep.json(reponse)
})

router.get ("/search/:search", async function(req, rep){

    const search = req.params.search

    const reponse = await Balade.find({
        $or: [
            { nom_poi: { $regex: search, $options: 'i' } }, 
            { texte_intro: { $regex: search, $options: 'i' } } 
        ]
    });

    rep.json(reponse)
})

router.get ("/site-internet", async function(req, rep){

    const reponse = await Balade.find({
         url_site: { $ne: null } 
    });

    rep.json(reponse)
})

router.get ("/mot-cle", async function(req, rep){

    const reponse = await Balade.find(
        { 'mot_cle.4' : {
            $exists: true}
    })

    rep.json(reponse)
})

router.get ("/publie/:annee", async function(req, rep){

    const year = req.params.annee;

const reponse = await Balade.find({
    date_saisie: { $regex: year, $options: 'i' }
}).sort({ date_saisie: 1 })

    rep.json(reponse)
})


router.get ("/synthese", async function(req, rep){

const reponse = await Balade.aggregate([
    { 
        $group: {
            _id: { $concat: [
                { $substr: ["$code_postal", 3, 1] }, // Troisième caractère
                { $substr: ["$code_postal", 4, 1] }  // Quatrième caractère
            ] },
            totalBalades: { $sum: 1 }
        }
    },
    { $sort: { _id: 1 } } 
]);

    rep.json(reponse)
})

router.get ("/arrondissement/:num", async function(req, rep){

    const num = req.params.num;

const reponse = await Balade.find({
    code_postal : { $regex: num, $options: 'i' }
    }).count()

    rep.json(reponse)
})


router.get ("/categories", async function(req, rep){

const reponse = await Balade.distinct("categorie")

    rep.json(reponse)
})


router.post("/add", async function(req, rep){
    
    const balade = req.body
    console.log("ok")
    
    if (!balade.nom_poi || !balade.adresse || !balade.categorie){
        return rep.status(400).json({ error: "Les champs 'nom_poi', 'adresse' et 'categorie' sont obligatoires" });
    }
    const nouvelleBalade = new Balade(balade)
    const reponse = await nouvelleBalade.save()
    rep.json(reponse)
})

router.put('/add-mot-cle/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { mot_cle } = req.body;

        if (!mot_cle) {
            return res.status(400).json({ error: 'Le mot clé est obligatoire.' });
        }

        const balade = await Balade.findById(id);

        if (!balade) {
            return res.status(404).json({ error: 'Balade non trouvée.' });
        }

        if (balade.mot_cle.includes(mot_cle)) {
            return res.status(400).json({ error: 'Le mot clé existe déjà.' });
        }

        balade.mot_cle.push(mot_cle);
        await balade.save();

        res.status(200).json(balade);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout du mot clé.' });
    }
});


router.put("/update-one/:id", async function(req, res) {
    const id = req.params.id;
    const verif = isValidObjectId(id);

    if (!verif){
        return res.status(400).json({msg : 'ID invalide'});
    }

    try {
        const balade = await Balade.findByIdAndUpdate(id, req.body, { new: true });

        if (!balade) {
            return res.status(404).json({ error: "Balade non trouvée" });
        }

        res.json({ message: "Balade mise à jour avec succès", balade });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la balade :", error);
        res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour de la balade" });
    }
});


router.put("/update-many/:search", async function(req, res) {
    const search = req.params.search;

    try {
        const balades = await Balade.updateMany({ texte_description: { $regex: search, $options: "i" } }, { nom_poi: req.body.nom_poi });

        res.json({ message: "Balades mises à jour avec succès", balades });
    } catch (error) {
        console.error("Erreur lors de la mise à jour des balades :", error);
        res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour des balades" });
    }
});


router.delete("/delete/:id", async function(req, res) {
    const id = req.params.id;
    const verif = isValidObjectId(id);

    if (!verif){
        return res.status(400).json({msg : 'ID invalide'});
    }

    try {
        const balade = await Balade.findByIdAndDelete(id);

        if (!balade) {
            return res.status(404).json({ error: "Balade non trouvée" });
        }

        res.json({ message: "Balade supprimée avec succès", balade });
    } catch (error) {
        console.error("Erreur lors de la suppression de la balade :", error);
        res.status(500).json({ error: "Une erreur s'est produite lors de la suppression de la balade" });
    }
});

export default router;






