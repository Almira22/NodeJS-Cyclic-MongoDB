


app.get("/:customListName",function(req,res){
  const customListName = req.params.customListName;
 
  List.findOne({name:customListName})
    .then(function(foundList){
        
          if(!foundList){
            const list = new List({
              name:customListName,
              items:defaultItems
            });
          
            list.save();
            console.log("saved");
            res.redirect("/"+customListName);
          }
          else{
            res.render("list",{listTitle:foundList.name, newListItems:foundList.items});
          }
    })
    .catch(function(err){});
 
 
  
  
})

//My CODE


app.get("/:customlistName",function(req,res){
  const customlistName = req.params.customlistName;

  List.findOne({name:customlistName}).then(function(err,foundList){
    if(!err){
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
    }
  })
  
});






//my code that worked with just the TODAY page
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




//new code

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


// const itemsSchema ={
//   name:String
// };

// const listSchema = {
//   name:String,
//   items:[itemsSchema]
//   };

// const List = mongoose.model("List",listSchema);

// const Item =  mongoose.model("Item",itemsSchema)

// const item1 = new Item ({
// name:"Welcome"
// });

// const item2 = new Item ({
//   name:"This"
//   });

// const item3 = new Item ({
// name:"Is"
// });

// const defaultItems = [item1,item2,item3];




// app.get("/", function(req, res) {

//   Item.find({}).then(function(foundItems){

//     if (foundItems.length==0){
//       Item.insertMany(defaultItems)
//       res.redirect("/");
//     } else{
//       res.render("list", { listTitle: "Today", newListItems: foundItems });}

// })
// });

// app.get("/:customlistName",function(req,res){
//   const customlistName = LoDashStatic.capitalize(req.params.customlistName);

//   List.findOne({name:customlistName}).then(function(foundList){
//       if(!foundList){
//         const list = new List({
//           name:customlistName,
//           items:defaultItems
//         });
//         list.save();
//         res.redirect("/"+customlistName);
//       }else{
//         res.render("list",{listTitle: foundList.name ,newListItems: foundList.items})
//       }
//     })
//   });

  
//   // app.post("/delete",(req,res)=>{
//   //   const checkedItemID = req.body.checkbox;
//   //   const listName = req.body.listName;
  
//   // Item.findByIdAndRemove(checkedItemID).then(function(err){
//   //   if (!err){
//   //     console.log("successfully deleted")
//   //   }
  
//   // });
//   // res.redirect("/");
//   // });

//   app.post("/delete",(req,res)=>{
//     const checkedItemID = req.body.checkbox;
//     const listName = req.body.listName;
  
//   Item.findByIdAndRemove(checkedItemID).then(function(err){
//     if (!err){
//       console.log("successfully deleted")
//     }
  
//   });
//   res.redirect("/");
//   });



// app.listen(3000, function() {
//   console.log("Server started on port 3000");
// });

 

 

 

 
const itemsSchema = {
    name: String,
};
 
const Item = mongoose.model("Item", itemsSchema);
 
const item1 = new Item({
    name: "Welcome to your todolist!"
});
 
const item2 = new Item({
    name: "Hit the + button to add a new item."
});
 
const item3 = new Item({
    name: "<-- Hit this to delete an item"
});
 
const defaultItems = [item1, item2, item3];
 
const listSchema = {
    name: String,
    items: [itemsSchema]
};
 
const List = mongoose.model("List", listSchema);
 
 
app.get("/", function(req,res){
 
    Item.find({})
        .then((foundItems) => {
 
            if(foundItems.length === 0){
                Item.insertMany(defaultItems)
                    .then(() => {
                        console.log("Successfully saved default items to DB.")
                    })
                    .catch((err) => {
                        console.log(err)
                    });
                res.redirect("/");
            } else{
                res.render("list", {listTitle: "Today", newListItems: foundItems});
            }
        });
});
 
app.get("/:customlistName", function(req, res){
 
  const customlistName = LoDashStatic.capitalize(req.params.customlistName);
 
    List.findOne({name: customlistName})
        .then((foundList) => {
            if(!foundList){
                // Create a new list
                const list = new List({
                    name: customlistName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customlistName);
            } else{
                // Show an existing list
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        });
});
 
app.post("/", function(req, res){
 
    const itemName = req.body.newItem;
    const listName = req.body.list;
 
    const item = new Item({
        name: itemName
    });
 
    if(listName === "Today"){
        item.save();
        res.redirect("/");
    } else{
        List.findOne({name: listName})
            .then((foundList) => {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            });
    }
});
 
app.post("/delete", function(req, res){
  const checkedListName = req.body.listName;
  const checkedItemId = req.body.checkbox;

  if(checkedlistName==="Today"){
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
      res.redirect("/" + checkedlistName);
    }
  }

});
 
 
app.listen(3000, function(){
    console.log("Server started on port 3000.");
});

//ejs

<!-- <%- include("header") -%>

  <div class="box" id="heading">
    <h1> <%= listTitle %> </h1>
  </div>

  <div class="box">

<% newListItems.forEach(function(item){ %>
    <form action="/delete" method="post">
      <div class="item">
        <input type="checkbox" name="checkbox" value ="<%=item._id%>" onChange="this.form.submit()">
        <p><%=item.name%></p>
      </div>
      <input type="hidden" name="listName" value="<% listTitle %>">
    </form>
      <% }) %>

      <form class="item" action="/" method="post">
         <input type="text" name="newItem" placeholder="New Item" autocomplete="off">
        why did we add listTitle in button value? Because when the form gets submitted we can get the value data and use it in the back end-->
        <!-- <button type="submit" name="list" value="<%=listTitle %>">+</button>
      </form>
  </div>

<%- include("footer") -%> --> 


//


require ("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose =require ("mongoose");
const date = require(__dirname + "/date.js");
const LoDashStatic = require("lodash");
const PORT = process.env.PORT


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

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


