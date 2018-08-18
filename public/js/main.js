'use strict';

function slideOut(elem, duration){
    elem.style.transition = "all " + duration + "ms";
    elem.style.opacity = 0;
    elem.style.height = 0;

    setTimeout(()=>{
        elem.remove();
    }, duration);
}

function removePantryItem(elem){
    var itemToDelete = Number(elem.getAttribute("buttonItem"));

    db.foodItems.where(":id").equals(itemToDelete).delete()
        .then(()=>{
            pantry.items = pantry.items.filter(item => item.id != itemToDelete);
            slideOut(elem.parentNode, 200);
        });    
}

function formatDate(unformattedDate){
    let splitDate = unformattedDate.split("-");
    return `${splitDate[1].replace(/^0/, "")}-${splitDate[2].replace(/^0/, "")}-${splitDate[0].slice(2)}`;
}

function expirationCheck(item){
    var today = new Date();
    var expirationtime= new Date(item.expoDate);
    let daystoExpiration = Math.abs(today.gettime()-expirationtime.gettime()); 
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    alert(diffDays);
    //should then write a loop to go through all the foods in pantry and print it 
}


/*
* this function adds a food item to the indexedDB
* It is fired when the "submit" buton is hit and then it takes
* the values in teh boxes and saves them.
*/
function addFoodItem(name, expoDate){
    
    if (expoDate != "") expoDate = formatDate(expoDate);

    db.foodItems.put({name: name, expoDate: expoDate}).then(function(id){
        return db.foodItems.get(id);
    }).then(function (foodItem){
        //after adding item, adding to display
        pantry.items.push(foodItem);
        createPantryItem(foodItem);
    }).catch(function(error) {
        alert ("Ooops: " + error);
    });  
}

function createPantryItem(item){
    let newElement = document.createElement("div");
    newElement.textContent = item.name;

    if(item.expoDate != "")
    {    
        var expoDateSpan = document.createElement("span");
        expoDateSpan.classList.add("expoDate");
        expoDateSpan.textContent = item.expoDate;
        newElement.appendChild(expoDateSpan);
    }
    var deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.textContent = "X";
    deleteButton.setAttribute("buttonItem", item.id); //this attribute of the button holds the id of the food item it represents so it can be easily deleted
    newElement.appendChild(deleteButton);

    pantryItemDisplay.appendChild(newElement);

    ""
    return newElement;
}

const pantry = {
    items: [],
    init: async function(){
        await db.foodItems.each(item => {
            this.items.push(item);
        })
        
        this.populatePantry();
    },
    populatePantry: function(){
        /*
        For each item in items array
        create a DOM element and append
        to pantryItemDisplay
        */
    
        pantryItemDisplay.innerHTML = "";
    
        this.items.forEach(item => {
            createPantryItem(item);
        })  
    },
    sortByExpo: function(){
        this.items.sort((itemA, itemB)=>{
            if (itemA.expoDate == "") return true;
            
            return new Date(itemA.expoDate) > new Date(itemB.expoDate);
        })

        this.populatePantry();
    }
}


const displayContent = (() => {
    const transitionDuration = 100;
    
    let currentContent;

    return elem => {
        
        if (elem === currentContent) return;
        
        if (currentContent != undefined){
            currentContent.style.opacity = 0;

            setTimeout(()=>{
                currentContent.style.display = "none";

                currentContent = elem;
                currentContent.style.display = "block";
                currentContent.style.opacity = 1;
            }, transitionDuration)
        }

        else {
            currentContent = elem;
            currentContent.style.display = "block";
            currentContent.style.opacity = 1;
        }
    }    
})();

// DOM Selections
const addButton = document.getElementById("addButton");
const sortButton = document.getElementById("sortButton");
const popUp = document.getElementById("addItemPopup");
const submitButton = document.getElementById("submitButton");
const pantryItemDisplay = document.getElementById("pantryItemDisplay");
const navOptions = document.querySelectorAll("nav div");
const content = document.querySelectorAll(".content");

// Event Listeners
navOptions.forEach(elem => {
    elem.addEventListener("click", function(event){
        displayContent(content[elem.getAttribute("key")]);
    });
});

addButton.addEventListener("click", function(event){
   popUp.style.visibility = "visible";
});

sortButton.addEventListener("click", function(event){
    pantry.sortByExpo();
});

submitButton.addEventListener("click", function(event){
    var foodInput = document.getElementById("foodName"),
        expoDate = document.getElementById("expoDate");
    
    if(foodInput.value == "") return; //not allowing blank items
    popUp.style.visibility = "hidden";
    addFoodItem(foodInput.value, expoDate.value);
});

// This event listener is on the whole pantry div
// When anywhere on the pantry is clicked, this gets triggered. 
// It then checks the id of what actually fired, and 
// if it was a delete button, then it will delete that item from the DB
pantryItemDisplay.addEventListener('click', function(event){
    if(event.target.classList.contains("delete"))
    {
        removePantryItem(event.target);
    }
});

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
}


// Define the database
const db = new Dexie("foodshare_database");
db.version(1).stores({
    foodItems: 'id++,name,expoDate'
});

// Display the current pantry
pantry.init();
displayContent(content[0]);