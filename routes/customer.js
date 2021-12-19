var express           =   require("express"),
    router            =   express.Router(),
    bodyParser       =   require("body-parser"),
    mysql             =   require("mysql");


router.use(bodyParser.json());

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
        console.log("Customer Connection successful")
    }
});

router.post("/customer/signup" ,function (req, res)  {

    upload(req, res, function(err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        return res.end("File uploaded sucessfully!.");
    });


    mysqlConnection.query('insert into customer(first_name,last_name,email_id,image_name,password,phone_number,city_city_id,country_id,address) values(?,?,?,?,?,?,?,?,?)',[req.body.signup.firstName, req.body.signup.lastName, req.body.signup.email, req.body.signup.image_name, req.body.signup.password, req.body.signup.phone_number, req.body.signup.city, req.body.signup.country, req.body.signup.address], function (error,rows,fields){
        if(error){
            console.log(req.body.singup);
            console.log(error);
            res.redirect("/");
        } else {   
            res.redirect("/customer/login");
        }
    }) 
});

//Route for Customer LOGIN FORM
router.get("/customer/login", function (req, res) {
    res.render("customer/login.ejs")
});

router.post("/customer/login", function(req,res){
    var login_username = req.body.login.username;
    var login_password = req.body.login.password;
    mysqlConnection.query('select * from customer where email_id = ?',[login_username], function (error,rows,fields){
        if(error){
            console.log(error);
            console.log("Error in customer login");
        } else {
            console.log(rows[0].email_id);
            if(login_username == rows[0].email_id && login_password == rows[0].password){
                res.redirect("/customer/profile/" + rows[0].email_id);
            }
            else{
                console.log("Wrong credentials");
            }
        } 
    })
});

router.get("/customer/profile/:id", function (req, res) {
    mysqlConnection.query('select * from customer,city,country where customer.email_id = ? and customer.city_city_id = city.city_id and customer.country_id = country.id;', [req.params.id], function (error,rows,fields){
        if(error){
            console.log("Error in /cusomter/profile data fetching");
        } else {
            console.log(rows[0]);
            res.render("customer/profile.ejs", {customer: rows[0]});
        }
    })    
});

router.get("/customer/list/:id2/:id", function(req,res){
    mysqlConnection.query('select city.name from city where city.city_id = ?',[req.params.id], function (error,city,fields){
        if(error){
            console.log(error);
            console.log("Error in city fetching");
        } else {
            mysqlConnection.query('select restaurant.image_name,restaurant.restaurant_name, restaurant_category.category, avg_cost.cost, delivery_fee.fee, restaurant.manager_email_id, manager.phone_number from restaurant,manager,avg_cost,delivery_fee,restaurant_category where restaurant.city_city_id = ? and restaurant.restaurant_category_category_id = restaurant_category.category_id and restaurant.avg_cost_avg_cost_id = avg_cost.avg_cost_id and restaurant.manager_email_id = manager.email_id and restaurant.delivery_fee_delivery_fee_id = delivery_fee.delivery_fee_id;',[req.params.id], function (error,list,fields){
                if(error){
                    console.log(error);
                    console.log("Error in city fetching");
                } else {
                    console.log(city[0]);
                    console.log(list);

                    res.render("customer/restaurants_list.ejs",{city: city[0], list :list, email_id: req.params.id2});
                } 
            })
        } 
    })
});



router.get("/customer/profile/edit/:id", function(req,res){
    mysqlConnection.query('select * from customer,city,country where customer.email_id = ? and customer.city_city_id = city.city_id and customer.country_id = country.id;', [req.params.id], function (error,rows,fields){
        if(error){
            console.log("Error in /cusomter/profile data fetching");
        } else {
            console.log(rows[0]);
            console.log("success")
            res.render("customer/profileEdit.ejs", {customer: rows[0]});
        }
    })
})

router.post("/customer/profile/edit/:id",function(req,res){
    mysqlConnection.query('update customer set first_name = ?,last_name = ? ,email_id = ? , image_name = ? , password = ?, phone_number = ?, city_city_id = ?, country_id = ?, address = ? where customer.email_id = ?;', [req.body.customer.first_name, req.body.customer.last_name,req.body.customer.email_id,req.body.customer.image_name,req.body.customer.password,req.body.customer.phone_number,req.body.customer.city,req.body.customer.country,req.body.customer.address,req.params.id], function (error,rows,fields){
        if(error){
            console.log("Error in /cusomter/profile/edit data fetching");
        } else {
            console.log(rows[0]);
            console.log("success");
            res.redirect("/customer/profile/" + req.params.id);
        }
    })
})
module.exports = router;