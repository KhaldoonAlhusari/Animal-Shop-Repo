const mongoose = require("mongoose");

const Animal = require("./models/animal");

mongoose.connect('mongodb://localhost:27017/animalShelter', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected.");
    })
    .catch((err) => {
        console.log(err);
    });

const animalList = [
    {
        animalInfo: {
            animal: "Dog",
            breed: "German Shepherd"
        },
        name: "Luna",
        age: 6,
        img: "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2016/06/21195710/German-Shepherd-Dog-laying-down-in-the-backyard-500x487.jpeg",
        category: "pet",
        trained: true
    },
    {
        animalInfo: {
            animal: "Dog",
            breed: "Shiba Inu"
        },
        name: "Kenji",
        age: 4,
        img: "https://www.treehugger.com/thmb/WG8aC3JmbUbgdbEuu_lRNIvQIos=/1412x1412/smart/filters:no_upscale()/lifespan.shibainu-4eb86713797240a2a0177f5d0adfc134.jpg",
        category: "pet",
        trained: true
    },
    {
        animalInfo: {
            animal: "Dog",
            breed: "Golden Retriever"
        },
        name: "Charlie",
        age: 9,
        img: "https://www.prestigeanimalhospital.com/sites/default/files/styles/large/public/golden-retriever-dog-breed-info.jpg",
        category: "pet",
        trained: true
    },
    {
        animalInfo: {
            animal: "Cat",
            breed: "Scottish Fold"
        },
        name: "Blue",
        age: 2,
        img: "https://i.pinimg.com/564x/27/81/78/278178e99264ca530b3b6ae6d70b43aa.jpg",
        category: "pet",
        trained: false
    },
    {
        animalInfo: {
            animal: "Cat",
            breed: "Munchkin"
        },
        name: "Loki",
        age: 3,
        img: "https://i.pinimg.com/736x/c9/1c/9e/c91c9e3ab08726ed53c1423a9c3935e8.jpg",
        category: "pet",
        trained: true
    },
    {
        animalInfo: {
            animal: "Fish",
            breed: "Goldfish"
        },
        name: "Goldie",
        age: 1,
        img: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Katri.jpg",
        category: "fish"
    },
    {
        animalInfo: {
            animal: "Fish",
            breed: "Angelfish"
        },
        name: "Angel",
        age: 5,
        img: "https://i.pinimg.com/originals/8e/43/dd/8e43ddd7a818092d495167cf8884ce31.jpg",
        category: "fish"
    },
    {
        animalInfo: {
            animal: "Horse",
            breed: "Friesian Horse"
        },
        name: "Diva",
        age: 7,
        img: "https://horseracingsense.com/wp-content/uploads/2019/08/Friesianhorse1.jpg",
        category: "farm",
        trained: true
    },
    {
        animalInfo: {
            animal: "Cow",
            breed: "Holstein Friesian Cattle"
        },
        name: "Maddie",
        age: 4,
        img: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Holstein_Friesian_UK_Yorkshire_July_2011.jpg",
        category: "farm"
    },
    {
        animalInfo: {
            animal: "cow",
            breed: "Limousin Cattle"
        },
        name: "Buttercup",
        age: 6,
        img: "https://www.livestockanimalexchange.com/wp-content/uploads/2019/10/Limousinc.png",
        category: "farm"
    },
    {
        animalInfo: {
            animal: "Chicken",
            breed: "Silkie"
        },
        name: "Dixie",
        age: 1,
        img: "https://i.pinimg.com/originals/a2/c3/e8/a2c3e86b06b51a81ba8f83c37ddd21a6.jpg",
        category: "farm"
    },
];

Animal.insertMany(animalList).then(m => console.log(m)).catch(e => console.log(e));