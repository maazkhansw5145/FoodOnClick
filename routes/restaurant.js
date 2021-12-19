var express         = require("express"),
    router          = express.Router(),
    mysql           = require("mysql");

    var mysqlConnection = mysql.createConnection({
        host: 'localhost',
        user:'root',
        password:'5145',
        database: 'foodononeclick'
    });
    
    mysqlConnection.connect((err)=> {
        if(err){
            console.log("This the error" + err)
        } else{
            console.log("Connection successful")
        }
    });


router.get("/restaurant/register", function(req,res){
    res.render("restaurant/register.ejs");
})

router.post("/restaurant/register",function(req,res){    
    mysqlConnection.query('insert into manager(email_id, phone_number, name, password) values(?,?,?,?)',[req.body.registration.email_id, req.body.registration.contactNumber, req.body.registration.managerName, req.body.registration.password], function (error,rows,fields){
        if(error){
            console.log("Error in manager data inseting ");
            console.log(error);
        } else {
            console.log(rows[0]);
            console.log("Manager part success");
        }
    
    mysqlConnection.query('insert into restaurant(restaurant_name, image_name, city_city_id, avg_cost_avg_cost_id, restaurant_category_category_id, delivery_fee_delivery_fee_id, manager_email_id) values(?,?,?,?,?,?,?)',[req.body.registration.name, req.body.registration.image_name, req.body.registration.city, req.body.registration.avg_cost, req.body.registration.category, req.body.registration.deliveryFee, req.body.registration.email_id], function (error,rows,fields){
        if(error){
            console.log("Error in restaurant data inseting ");
            console.log(error);
        } else {
            console.log(rows[0]);
            console.log("restaurant part success");
            res.redirect("/restaurant/login");
        }
    })
    })
})


//Route for Restaurant Owner LOGIN FORM
router.get("/restaurant/login", function (req, res) {
    res.render("restaurant/login.ejs")
});

router.post("/restaurant/login", function(req,res){
    var login_username = req.body.login.username;
    var login_password = req.body.login.password;
    console.log(login_username);
    console.log(login_password);
    
    mysqlConnection.query('select * from manager where manager.email_id = ?',[login_username], function (error,rows,fields){
        if(error){
            console.log(error);
            console.log("Error in restaurant login");
        } else {
            console.log(rows[0]);
            if(login_username == rows[0].email_id && login_password == rows[0].password){
                res.redirect("/restaurant/manager/" + login_username);
            }
            else{
                console.log("Wrong credentials");
            }
        } 
    })
});

router.get("/restaurant/manager/:id", function(req,res){
    mysqlConnection.query('select restaurant_id,restaurant_name,image_name from restaurant where manager_email_id = ?',[req.params.id], function (error,rows,fields){
        if(error){
            console.log(error);
            console.log("Error in manager/:id");
        } else {
            mysqlConnection.query('select item_id,item_name,image_name, item_price from item where item.restaurant_restaurant_id = ?',[rows[0].restaurant_id], function (error,item_rows,fields){
                if(error){
                    console.log(error);
                    console.log("Error in manager/:id");
                } else {
                    mysqlConnection.query('select item.item_name,`order`.time,`order`.order_id,customer.first_name, customer.address, customer.phone_number from item,`order`,customer where `order`.restaurant_restaurant_id = ? and `order`.status_id = 1 and customer.email_id = `order`.customer_email_id and item.item_id = `order`.item_item_id;',[rows[0].restaurant_id], function (error,order_rows,fields){
                        if(error){
                            console.log(error);
                            console.log("Error in manager/:id");
                        } else {
                    // mysqlConnection.query('select sum(rating_value) as ratings from ratings where ratings.item_item_id = ?;',[item_rows[0].item_id], function (error,ratings,fields){
                    //     if(error){
                    //         console.log(error);
                    //         console.log("Error in manager/:id");
                    //     } else {
                    //             console.log(rows[0]);
                                console.log(item_rows);
                                console.log(order_rows);
                                res.render("restaurant/manager.ejs",{item : item_rows,restaurant: rows[0],email_id : req.params.id,order: order_rows});
                        //     }
                        // }) 
                        }
                    })   
                    }
                })
            }
        })  
});

router.get("/restaurant/menu/:id/:id2", function(req,res){
    mysqlConnection.query('select restaurant_name,restaurant_id from restaurant where manager_email_id = ?',[req.params.id], function (error,rows,fields){
        if(error){
            console.log(error);
            console.log("Error in manager/:id");
        } else {
            mysqlConnection.query('select item_id,item_name,image_name, item_price from item where item.restaurant_restaurant_id = ?',[rows[0].restaurant_id], function (error,item_rows,fields){
                if(error){
                    console.log(error);
                    console.log("Error in manager/:id");
                } else {
                    console.log(rows[0]);
                    console.log(item_rows);
                    res.render("restaurant/menu.ejs",{item: item_rows,restaurant: rows[0], email_id : req.params.id2});
                    }
                })
            }
        })
            // mysqlConnection.query('select ratings.rating_value, reviews.review from ratings,reviews where reviews.item_item_id = ? and ratings.item_item_id = ?;',[menu.item_id,menu.item_id], function (error,rows,fields){
            //     if(error){
            //         console.log(error);
            //         console.log("Error in manager/:id");
            //     } else {
            //         console.log(rows[0]);
            //         menu += rows[0];
                
            //         }
            //     })

})

router.get("/restaurant/profile/:id",function(req,res){
    console.log(req.params.id);
    mysqlConnection.query('select restaurant.restaurant_name,restaurant.image_name,manager.name as manager_name,manager.email_id,avg_cost.cost,restaurant_category.category,delivery_fee.fee,manager.phone_number,city.name as city_name from restaurant,manager,city,avg_cost,restaurant_category,delivery_fee where manager.email_id = ? and manager.email_id = restaurant.manager_email_id  and restaurant.city_city_id = city.city_id and restaurant.avg_cost_avg_cost_id = avg_cost.avg_cost_id and restaurant.delivery_fee_delivery_fee_id = delivery_fee.delivery_fee_id and restaurant.restaurant_category_category_id = restaurant_category.category_id;',[req.params.id], function(error,rows,fields){
        if(error){
            console.log(error);
            console.log("Error in /restaurant/profile");
        } else {
            console.log(rows[0]);
            res.render("restaurant/profile.ejs",{restaurant: rows[0]});
            }
        })  
});

router.get("/restaurant/profile/edit/:id", function(req,res){
    var email_id = req.params.id;
    mysqlConnection.query('select restaurant.restaurant_name,restaurant.image_name,manager.name as manager_name,manager.email_id,avg_cost.cost,restaurant_category.category,delivery_fee.fee,manager.phone_number,city.name as city_name from restaurant,manager,city,avg_cost,restaurant_category,delivery_fee where manager.email_id = ? and manager.email_id = restaurant.manager_email_id  and restaurant.city_city_id = city.city_id and restaurant.avg_cost_avg_cost_id = avg_cost.avg_cost_id and restaurant.delivery_fee_delivery_fee_id = delivery_fee.delivery_fee_id and restaurant.restaurant_category_category_id = restaurant_category.category_id;',[email_id], function(error,edit,fields){
        if(error){
            console.log(error);
            console.log("Error in /restaurant/profile");
        } else {
            console.log(edit[0]);
            res.render("restaurant/profileEdit.ejs",{restaurant: rows[0]});
            }
        })  
});

router.post("/restaurant/profile/edit/:id",function(req,res){
    //LOGIC FOR EDITING RES PROFILE GOES HERE
    mysqlConnection.query('update restaurant,manager set restaurant_name = ?, image_name = ?, city_city_id = ?, avg_cost_avg_cost_id = ?, restaurant_category_category_id = ?, delivery_fee_delivery_fee_id = ?, manager.name = ?,manager.phone_number = ?, manager.password = ? where manager.email_id = ? and manager.email_id = restaurant.manager_email_id;',[req.body.restaurantProfile.name,req.body.restaurantProfile.image_name,req.body.restaurantProfile.city,req.body.restaurantProfile.avg_cost,req.body.restaurantProfile.category,req.body.restaurantProfile.deliveryFee,req.body.restaurantProfile.manager_name,req.body.restaurantProfile.phone_number,req.body.restaurantProfile.password,req.params.id], function (error,rows,fields){
        if(error){
            console.log(error);
            console.log("Error in /restaurant/profile/edit");
        } else {
            console.log(rows[0]);
            res.redirect("/restaurant/profile/" + req.params.id);
            }
        })
});

module.exports = router;