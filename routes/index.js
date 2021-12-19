var express         = require("express"),
    router          = express.Router();

//Homepage route
router.get("/",function(req,res){
    res.render("landing.ejs");
});

router.get("/restaurants/list",function(req,res){
    restaurantModel.find({},function(err,allRestaurants){
        if(err){
            console.log(err);
        }else{
            res.render("restaurant/list.ejs",{allRestaurants: restaurant});        
        }
    })
})

module.exports = router;