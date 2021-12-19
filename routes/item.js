var express         =   require("express"),
    router          =   express.Router(),
    mysql           =   require("mysql");

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
        console.log("item connection successful")
    }
});
    
router.get("/item/add/:idRes",function(req,res){
    console.log(req.params.idRes);
    res.render("item/add.ejs",{restaurant_id : req.params.idRes});
})

router.post("/item/add/:idRes",function(req,res){  
    mysqlConnection.query('insert into item(item_name, item_price, image_name, permissibility_permissibilty_id,item_category_item_category_id, restaurant_restaurant_id) values(?,?,?,?,?,?)',[req.body.item.name,req.body.item.price,req.body.item.image_name,req.body.item.permissibilty,req.body.item.category,req.params.idRes], function (error,item,fields){
        if(error){
            console.log("line 27 Error in post /item/add data inseting fails");
            console.log(error);
        } else {
            mysqlConnection.query('select restaurant.manager_email_id from restaurant where restaurant.restaurant_id = ?',[req.params.idRes], function (error,email_id,fields){
                if(error){
                    console.log("line 27 Error in post /item/add data inseting fails");
                    console.log(error);
                } else {
            
                    console.log(item[0]);
                    console.log("Item addition successful");
                    res.redirect("/restaurant/manager/" + email_id[0].manager_email_id);
                    
            
                }
            })
        }
    })
});

router.get("/item/edit/:id",function(req,res){
    mysqlConnection.query('select * from item where item.item_id = ?;', [req.params.id], function (error,rows,fields){
        if(error){
            console.log("Error in get /item/edit data fetching");
        } else {
            console.log(rows[0]);
            console.log("success")
            res.render("item/edit.ejs", {item: rows[0]});
        }
    })
})

router.post("/item/edit/:id",function(req,res){
    //LOGIC FOR UPDATION GOES HERE
    mysqlConnection.query('update item set item_name = ?, item_price = ?, image_name = ?, permissibility_permissibilty_id = ?,item_category_item_category_id = ? where item_id = ?',[req.body.itemEdit.name,req.body.itemEdit.price,req.body.itemEdit.image_name,req.body.itemEdit.permissibilty,req.body.itemEdit.category,req.params.id], function (error,rows,fields){
        if(error){
            console.log("Error in line 64 /item/add data inseting fails");
            console.log(error);
        } else { 
            mysqlConnection.query('select restaurant.manager_email_id from restaurant,item where item.item_id = ? and restaurant.restaurant_id = item.restaurant_restaurant_id;',[req.params.id], function (error,email_id,fields){
            if(error){
                console.log("line 69 Error in post /item/add data inseting fails");
                console.log(error);
            } else {
                console.log("Item edit successful");
                res.redirect("/restaurant/manager/" + email_id[0].manager_email_id);
            }
        })
        }
    })
})

router.get("/item/order/:id/:idEmail", function(req,res){
    console.log(req.params.id);
    mysqlConnection.query('select * from item where item.item_id = ?',[req.params.id], function (error,rows,fields){
        if(error){
            console.log(error);
            console.log("Error in manager/:id");
        } else {
            console.log("Success:first query in line 63 successfull")
            
            mysqlConnection.query('select restaurant_name,restaurant_id,fee from restaurant,delivery_fee where restaurant.restaurant_id = ? and restaurant.delivery_fee_delivery_fee_id = delivery_fee.delivery_fee_id;',[rows[0].restaurant_restaurant_id], function (error,restaurant_rows,fields){
                if(error){
                    console.log(error);
                    console.log("error in 2nd query line 63")
                    console.log("Error in get /item/order/:id data fetching");

                } else {
                    console.log(rows);
                    console.log(restaurant_rows[0]);
                    res.render("item/order.ejs",{restaurant: restaurant_rows[0], item: rows[0], email_id : req.params.idEmail});
                }
            })
        }
    })
})

router.post("/item/order/:idRest/:idItem/:idEmail",function(req,res){
    var restaurant_id = Number(req.params.idRest);
    var item_id = Number(req.params.idItem);
    mysqlConnection.query('select customer.address from customer where customer.email_id = ?',[req.params.idEmail], function (error,customer,fields){
        if(error){
            console.log(error);
            console.log("Error in manager/:id");
        } else {

            mysqlConnection.query('insert into `order`(time,restaurant_restaurant_id,customer_email_id,status_id,item_item_id) values(?,?,?,?,?)',[req.body.order.time,restaurant_id,req.params.idEmail,1,item_id], function (error,rows,fields){
                if(error){
                    console.log(error);
                    console.log("Error in manager/:id line 88");
                } else {
                    console.log("Order send successfully");
                    res.redirect("/customer/profile/" + req.params.idEmail);
                }
            })
        }
    })

})

router.get("/item/order/done/:idRest/:idOrder",function(req,res){
    mysqlConnection.query('update `order` set `order`.status_id = 2 where `order`.order_id = ?',[req.params.idOrder], function (error,rows,fields){
        if(error){
            console.log("Error in line 64 /item/add data inseting fails");
            console.log(error);
        } else { 
            mysqlConnection.query('select restaurant.manager_email_id from restaurant where restaurant.restaurant_id = ?;',[req.params.idRest], function (error,restaurant_email_id,fields){
            if(error){
                console.log("line 69 Error in post /item/add data inseting fails");
                console.log(error);
            } else {
                console.log("Item edit successful");
                
                var email_id = restaurant_email_id[0].manager_email_id;
                console.log(email_id);
                res.redirect("/restaurant/manager/" + email_id);
            }
        })
        }
    }) 
})   

module.exports = router;