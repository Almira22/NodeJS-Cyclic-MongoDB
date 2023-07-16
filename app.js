
const express = require("express");
const bodyParser = require("body-parser");
const mongoose =require ("mongoose");
const date = require(__dirname + "/date.js");
const LoDashStatic = require("lodash");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-almira:Password.1@cluster0.lh5mzy0.mongodb.net/todolistDB");


const itemsSchema ={
  name:String
};

const listSchema = {
  name:String,
  items:[itemsSchema]
  };

const List = mongoose.model("List",listSchema);

const Item =  mongoose.model("Item",itemsSchema)

const item1 = new Item ({
name:"Welcome"
});

const item2 = new Item ({
  name:"This"
  });

const item3 = new Item ({
name:"Is"
});

const defaultItems = [item1,item2,item3];




app.get("/", function(req, res) {

  Item.find({}).then(function(foundItems){

    if (foundItems.length==0){
      Item.insertMany(defaultItems)
      res.redirect("/");
    } else{
      res.render("list", { listTitle: "Today", newListItems: foundItems });}

})
});

app.get("/:customlistName",function(req,res){
  const customlistName = LoDashStatic.capitalize(req.params.customlistName);

  List.findOne({name:customlistName}).then(function(foundList){
      if(!foundList){
        const list = new List({
          name:customlistName,
          items:defaultItems
        });
        list.save();
        res.redirect("/"+customlistName);
      }else{
        res.render("list",{listTitle: foundList.name ,newListItems: foundList.items})
      }
    })
  });

  
  app.post("/delete",(req,res)=>{
    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName;
  
  Item.findByIdAndRemove(checkedItemID).then(function(err){
    if (!err){
      console.log("successfully deleted")
    }
  
  });
  res.redirect("/");
  });




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
