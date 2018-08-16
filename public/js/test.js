describe("createPantryItem", function() {

    const dummyItem = {
        name: "dummyItem",
        expoDate: "1980-08-23"
    }

    it("adds a child under #pantryItemDisplay div", function() {
      assert.equal(pantryItemDisplay.children.length + 1, (()=>{
        console.dir(pantryItemDisplay.children);
        createPantryItem(dummyItem);
        console.dir(pantryItemDisplay.children);

        return pantryItemDisplay.children.length;
      })())

      pantryItemDisplay.firstElementChild.remove();

    });

});

describe("formatDate", function() {
    describe("converts date strings from YYYY-MM-DD to (M)M-(D)D-YY", function(){
        it("converts 1980-08-23 to 8-23-80", function() {
            assert.equal(formatDate("1980-08-23"), "8-23-80");
        });
        it("converts 2010-10-03 to 10-3-10", function() {
            assert.equal(formatDate("2010-10-03"), "10-3-10");
        });
        it("converts 2011-11-11 to 11-11-11", function() {
            assert.equal(formatDate("2011-11-11"), "11-11-11");
        });
    })
});

describe("removePantryItem", ()=>{
    
    let dummyId,
        dummyElement;

    db.foodItems.put({name: "delete test", expoDate: ""}).then(function(id){
        return db.foodItems.get(id);
    }).then(function (foodItem){
        //after adding item, adding to display
        dummyElement = createPantryItem(foodItem);
        dummyId = foodItem.id;
        removePantryItem(dummyElement);
    }).catch(function(error) {
        alert ("Ooops: " + error);
    });  

    it("removes item from the db", function() {
        db.foodItems.get(dummyId)
            .then(() => {
                assert(false);
            })
            .catch(e => {
                // get method should fail...
                console.log("inside catch");
                assert(true);
            })
    });
});

// mocha.run();