describe("formatDate", function() {

    it("converts date strings from YYYY-MM-DD to (M)M-(D)D-YY", function() {
      assert.equal(formatDate("1980-08-23"), "8-23-80");
      assert.equal(formatDate("2010-10-03"), "10-3-10");
    });
});

describe("createPantryItem", function() {

    const dummyItem = {
        name: "dummyItem",
        expoDate: "1980-08-23"
    }

    it("adds a child under #pantryItemDisplay div", function() {
      assert.equal(pantryItemDisplay.children.length + 1, (()=>{
        createPantryItem(dummyItem);
        return pantryItemDisplay.children.length;
      })())

      pantryItemDisplay.firstElementChild.remove();

    });

});

describe("formatDate", function() {

    it("converts date strings from YYYY-MM-DD to (M)M-(D)D-YY", function() {
      assert.equal(formatDate("1980-08-23"), "8-23-80");
      assert.equal(formatDate("2010-10-03"), "10-3-10");
    });
});
