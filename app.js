//jshint esversion:6


const _ = require("lodash")


const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose")
const app = express();

mongoose.connect("mongodb+srv://barisozcan105:6Q7OiYjrCGXlZuaB@cluster0.lo1udff.mongodb.net/itemDB")

const itemSchema={
  name:String
}
const itemtemplate=mongoose.model("item",itemSchema)


const item1=new itemtemplate({
  name:"FuckYourSelf"
})
const item2=new itemtemplate({
  name:"FuckYourSelf"
})
const item3=new itemtemplate({
  name:"FuckYourSelf"
})

let default_items=[item1,item2,item3]






const listschema={
  name:String,
  items:[itemSchema]
}

const listtemplate=mongoose.model("list",listschema)


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", function(req, res) {

  itemtemplate.find({}).then(
    (data)=>{
      if(data.length===0){
        const item1=new itemtemplate({
          name:"FuckYourSelf"
        })
        const item2=new itemtemplate({
          name:"FuckYourSelf"
        })
        const item3=new itemtemplate({
          name:"FuckYourSelf"
        })
        itemtemplate.insertMany([item1,item2,item3]).then(console.log("updated"))
      }
        items=data
        res.render("list", {listTitle:"Today", newListItems: items});
      }

    
    
    )

  

});


app.post("/delete",async(req,res)=>{
  var checkbox=req.body.checkbox
  var listname=req.body.listName
  if(listname==="Today"){
    itemtemplate.deleteOne({_id:checkbox}).then(console.log("Deleted Successfuly"))
    res.redirect("/")
  }else{
    await listtemplate.findOneAndUpdate({name:listname},{$pull:{items:{_id:checkbox}}}).then(console.log("successful"))
    res.redirect("/"+listname)
  }
  
  
})

app.get("/:name",(req,res)=>{
  const variable=_.capitalize(req.params.name)
  listtemplate.findOne({name:variable}).
  then(found=>{
    if(found)
    {console.log("succesfull")
    res.render("list", {listTitle:found.name, newListItems:found.items});  
  }
    else{
    console.log("doesn't exist")
    const list=new listtemplate({
      name:variable,
      items:default_items
    })
    list.save()
    res.redirect(`/${variable}`)
  }
  
}
  )

})



app.post("/", async function(req, res){
  console.log(req.body)
  const list_name=req.body.list
  const item_name = req.body.newItem;
  var item=new itemtemplate({
    name:item_name
  })
  if(list_name==="Today"){
    item.save()
    res.redirect("/")
  }else{
    var itemlist=[]
    await listtemplate.findOne({name:list_name}).then(found=>{found.items.push(item);console.log(found);itemlist=found.items})
    console.log(itemlist)
    await listtemplate.updateOne({name:list_name},{items:itemlist}).then(console.log("Checkout")).catch(err=>{console.log(err)})
    res.redirect("/"+list_name)
  }

});



app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
