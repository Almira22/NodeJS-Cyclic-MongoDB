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

