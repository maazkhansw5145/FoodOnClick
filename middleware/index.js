var customerModel   =   require("../models/customer.js");
var itemModel       =   require("../models/item.js");
var restaurantModel =   require("../models/customer.js");
var reviewsModel    =   require("../models/reviews.js");
var ratingsModel    =   require("../models/ratings.js");
var orderModel      =   require("../models/order.js");
var multer          =   require("multer");
var path            =   require("path");



var middlewareObj = {};
middlewareObj.restaurantOwnership = function(req,res,next){
        if(req.isAuthenticated()){
            restaurantModel.findById(req.params.id, function(err,foundRestaurant){
                if(err){
                    req.flash("error","Restaurant not found!");
                    res.redirect("back");
                }else{
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    }else{
                        req.flash("error","You don't have permission")
                        res.redirect("back");
                    }
                }
            })
        }else{
            req.flash("error","You did not own it")
            res.redirect("back");
        }
    }
    
middlewareObj.checkReviewOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        reviewModel.findById(req.params.comment_id, function(err,foundComment){
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have the permission");
                    res.redirect("back");
                }
                
            }
        })
    }else{
        req.flash("error","You need to be logged in first");
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First!");
    res.redirect("/login");
}


// //item storage engine 
// const itemStorage = multer.diskStorage({
// 	destination: "./public/uploads/customer",
// 	filename: function(req, file, cb){
// 	    path.extension(file.orignalname)
// 	}
// });

// //Restaurant storage engine 
// const restaurantStorage = multer.diskStorage({
// 	destination: "./public/uploads/customer",
// 	filename: function(req, file, cb){
// 	    path.extension(file.orignalname)
// 	}
// });





module.exports = middlewareObj;