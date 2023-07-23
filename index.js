
require ("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose =require ("mongoose");
const date = require(__dirname + "/date.js");
const LoDashStatic = require("lodash");
const PORT = process.env.PORT || 3000;


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-almira:Password.1@cluster0.lh5mzy0.mongodb.net/todolistDB");


const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

//initial items in list 
const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems= [item1, item2, item3];

// const foundItems = await Item.find({});

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

  fItems().catch(err => console.log(err));

  async function fItems(){
    const foundItems = await Item.find({});

    if(foundItems.length===0){
      Item.insertMany(defaultItems);
      res.redirect("/");
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  }
  
});

app.get("/:customListName", function(req, res){

  const customListName =LoDashStatic.capitalize(req.params.customListName);

  findOne().catch(err => console.log(err));

  async function findOne(){
    const foundList = await List.findOne({name: customListName});

    if(!foundList){
      //Create a new list
      const list = new List({
        name: customListName,
        items: defaultItems
      });
  
      list.save();
      res.redirect("/" +customListName); 
    } else{
      //Show an existing list

      res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
    }
  }

});

app.post("/", function(req, res){

  const itemName= req.body.newItem;

  const listName= req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName==="Today"){
    //in the default list
    item.save();
    res.redirect("/");
  } else{
    //in custom list
    findCustomList().catch(err => console.log(err));

    async function findCustomList(){
      const foundList = await List.findOne({name: listName});

      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    }
  }
});

app.post("/delete", function(req, res){
  const checkedListName = req.body.listName;
  const checkedItemId = req.body.checkbox;

  if(checkedListName==="Today"){
    //In the default list
    del().catch(err => console.log(err));

    async function del(){
      await Item.deleteOne({_id: checkedItemId});
      res.redirect("/");
    }
  } else{
    //In the custom list

    update().catch(err => console.log(err));

    async function update(){
      await List.findOneAndUpdate({name: checkedListName}, {$pull: {items: {_id: checkedItemId}}});
      res.redirect("/" + checkedListName);
    }
  }

});


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});


