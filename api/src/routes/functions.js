const { default: axios } = require('axios');
const { Router } = require('express');
const { API_KEY } = process.env
const { Dog, Temperament } = require('../db')

const router = Router()

const getDogApi = async() => {
    try {
        const res = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)
        const dog = res.data.map(d => {
            return {
                id: d.id,
                name: d.name,
                weight: d.weight.metric,
                height: d.height.metric,
                temperament: d.temperament,
                image: d.image.url
            }
        })
        return dog
    } catch (error) {
        console.log(error)
    }
}

const getDogDb = async() => {
    const data = await Dog.findAll({
        attributes: ['id', 'name', 'weight','image'],
        include: {
            model: Temperament,
            attributes: ['name'],
            through: {
                attributes: [],
            }
        }
    });
    return data;
}

const getAllDogs = async() => {
    const res1 = await getDogApi()
    const res2 = await getDogDb()
    const resF = res1.concat(res2)
    return resF
}

const getDetails = async() => {
    try {
        const dataApi = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)
        const dogsApi = dataApi.data.map( d => {
            return {
                id: d.id, 
                name: d.name, 
                weight: d.weight.metric , 
                height: d.height.metric , 
                image: d.image.url , 
                life_span: d.life_span,
                temperament: d.temperament, 
            }
        })
        return dogsApi;
    } catch (error) {
        console.log(error)
    }
}

const getDbDetails = async () => {
    const dataBd = await Dog.findAll({
        include: {
            model: Temperament,
            attributes: ['name'],
            through: {
                attributes: [],
            }
        }
    });
    return dataBd;
} 

const getAllDetails = async() => {
    const data1 = await getDetails();
    const data2 = await getDbDetails();
    const finalDetails = data1.concat(data2);
    return finalDetails;
}

const getTemps = async() => {
    const getInfo = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)
    const temps = await getInfo.data.map(t => t.temperament && t.temperament.split(", "));
    const arr = temps.flat();
    const tempsFiltered = arr.reduce((i, t) =>{
        if(!i.includes(t)) i.push(t)
        return i
    }, [])

    tempsFiltered.forEach(async t => {
      if(t){
        await Temperament.findOrCreate({
             where: {name: t}
      })
      }
    })
    const allTemps = await Temperament.findAll();
    return allTemps;
}

module.exports = { 
    router,
    getAllDogs,
    getAllDetails,
    getTemps
}



