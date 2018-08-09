
window.alert("HEY YOUR JAVASCRIPT IS HERE");

var addButtonItem = document.getElementById("addButton");
var popUp = document.getElementById("addItemPopup");

addButtonItem.addEventListener("click", function(event){
   popUp.style.visibility = "visible";
});


var submitButton = document.getElementById("submitButton");

submitButton.addEventListener("click", function(event){
    popUp.style.visibility = "hidden";
});