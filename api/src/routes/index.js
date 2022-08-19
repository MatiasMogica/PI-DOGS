const { default: axios } = require('axios');
const { Router } = require('express');
const { getAllDogs, getAllDetails, getTemps } = require('./functions');
const { API_KEY } = process.env
const { Dog, Temperament } = require('../db')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get('/dogs', async(req, res, next) => {
    const {name} = req.query
    const dogs = await getAllDogs()
    try {
        let dogsName = []
        if(name){
            dogs.map(d => {
                if(d.name.toLowerCase().includes(name.toLowerCase())){
                    dogsName.push({
                        id: d.id,
                        name: d.name,
                        weight: d.weight,
                        image:d.image,
                        temperament: d.temperament
                    })
                }
            })
            dogsName.length ? res.status(200).json(dogsName) : res.status(404).json('Dog not found')
        }else{
            return res.json(dogs)
        }
    } catch (error) {
        next(error)
    }
})

router.get('/dogs/:idRaza', async(req, res, next) => {
    const id = req.params.idRaza
    const details = await getAllDetails()
    try {
        if(!id.includes("-")){
            const filterDetails = await details.filter(d => d.id == Number(id))
            filterDetails.length ? res.status(200).json(filterDetails) : res.status(404).json('Id not found')
        }else{
            let bdDetails = await Dog.findAll({
                where: {id},
                include: [{
                    model: Temperament,
                    attributes: ['name'],
                    through: {
                        attributes: []
                    }
                }]
            })
            bdDetails.length ? res.status(200).json(bdDetails) : res.status(404).json('Id not found')
        }
    } catch (error) {
        next(error)
    }
})

router.post('/dogs', async(req, res, next) => {
    const { name, id, height, weight, life_span, image, temperament } = req.body
    console.log('ESTE TEMPERAMENT', temperament)
    try {
        const newDog = await Dog.create({
            name,
            id,
            height,
            weight,
            life_span,
            image
        })
        
        console.log('ESTO ES TEMPERAMENTDB', temperamentDb)
        await newDog.addTemperament(temperament)
        return res.status(200).json(`Race: ${name}, created successfully`)
    } catch (error) {
        next(error)
    }
})

router.get('/temperaments', async(req, res, next) =>{
    try {
        const allTemperaments = await getTemps();
        return res.status(200).json(allTemperaments);
    } catch (error) {
        next(error);
    }
})

module.exports = router;
