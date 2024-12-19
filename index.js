const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const jwt = require('jsonwebtoken');

const cors = require('cors')
app.use(cors())

const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'myrecipeholder'
});
 
connection.connect((err) => {
  if(err) {
    console.log(err);
  } else {
    console.log("Connected to DB");
  }
});

const jwtpass = 'sdfjhioerhfdsnoaidfjpergr fhrwifiowr dfif';

/* app.get('/', function (req, res) {
  res.send('Hello World')
}) */

/* var distDir = path.join(__dirname,"dist","MyRecipeHolder");
app.use(express.static(distDir));

app.get("/*",(req,res) => {
  res.sendFile(path.join(__dirname,"dist","MyRecipeHolder","index.html"))
}); */

// api to show categories
app.get("/categories", (req, res) => {
  const query = "SELECT * FROM category"
  connection.query(query, (err, result) => {
    if(err) {
      console.log(err);
      res.status(500).send({
        success: false,
        msg: 'Server Error',
        data: []
      })
    } else {
      console.log(result);
      res.send({
        success: true,
        msg: 'Success',
        data: result
      })
    }
  });
});

// api to show recipe details
app.get("/recipe_details",(req,res) => {
  const query = "SELECT * FROM category_detail"
  connection.query(query, (err, result) => {
    if(err) {
      console.log(err);
      res.status(500).send({
        success: false,
        msg: 'Server Error',
        data: []
      })
    } else {
      console.log(result);
      res.send({
        success: true,
        msg: 'Success',
        data: result
      })
    }
  })
})

// api to add category
app.post("/add_category", (req, res) => {
  const category_name = req.body.category_name;
  const user_id =  req.body.user_id;

  const query = "INSERT INTO category (category_name,user_id) VALUES (?,?)";
  connection.query(query, [category_name, user_id], (err,result) => {
    if(err) {
      res.status(500).send({
        success: false,
        msg: "Server Error",
        data: []
      });
    } else {
      res.status(201).send({
        success: true,
        msg: "Success",
        data: result.insertId
      })
    }
  })
});

// api to add recipe details
app.post("/add_recipe", (req, res) => {
  const recipe_name = req.body.recipe_name;
  const recipe_link = req.body.recipe_link;
  const recipe_desc = req.body.recipe_desc;
  const category_id = req.body.category_id;

  const query = `INSERT INTO category_detail (recipe_name,recipe_link,recipe_desc, category_id) VALUES (?,?,?,?)`;
  connection.query(query, [recipe_name,recipe_link,recipe_desc,category_id], (err,result) => {
    if(err) {
      res.status(500).send({
        success: false,
        msg: "Server Error",
        data: []
      });
    } else {
      res.status(201).send({
        success: true,
        msg: "Success",
        data: result.insertId
      })
    }
  })
});

// api to delete category name
app.delete('/delete_category/:category_id',(req,res) => {
  const category_id = req.params.category_id;
  const query = "DELETE FROM category WHERE category_id = ?";
  connection.query(query, [category_id], (err, result) => {
      if(err) {
          res.status(500).send({
              success : false,
              msg: "Server Error",
              data: []
          });
      } else {
          res.status(201).send({
              success: true,
              msg: "Success",
              data: result.affectedRows
          })
      }
  })
});

// api to delete recipe details
app.delete('/delete_recipe/:recipe_id',(req,res) => {
  const recipe_id = req.params.recipe_id;
  const query = "DELETE FROM category_detail WHERE recipe_id = ?";
  connection.query(query, [recipe_id], (err, result) => {
      if(err) {
          res.status(500).send({
              success : false,
              msg: "Server Error",
              data: []
          });
      } else {
          res.status(201).send({
              success: true,
              msg: "Success",
              data: result.affectedRows
          })
      }
  })
}); 

//Update category name 
app.put('/update_category_name/:category_id',(req,res) => {
  const category_id = req.params.category_id;
  const category_name = req.body.category_name;
  const query = "UPDATE category SET category_name = ? WHERE category_id = ?";
  connection.query(query, [category_name,category_id], (err, result) => {
      if(err) {
          res.status(500).send({
              success : false,
              msg: "Server Error",
              data: []
          });
      } else {
          res.status(201).send({
              success: true,
              msg: "Success",
              data: result.affectedRows
          })
      }
  })
});

// Get single category by category_id
app.get('/get_category_name_by_id/:category_id',(req,res) => {
  const category_id = req.params.category_id;
  const query = "SELECT category_name FROM category WHERE category_id = ?";
  connection.query(query,category_id,(err, result) => {
      if(err){
          console.log(err);
          res.status(500).send({
              success: false,
              msg: 'Server Error',
              data: []
          })
      } else {
          res.send({
              success: true,
              msg: 'Success',
              data: result
          })
      }
  })
});

// Get single recipe by category_id
app.get('/get_recipe_by_id/:category_id',(req,res) => {
  const category_id = req.params.category_id;
  const query = "SELECT recipe_id,recipe_name,recipe_link,recipe_desc,category_id FROM category_detail WHERE category_id = ?";
  connection.query(query,category_id,(err, result) => {
      if(err){
          console.log(err);
          res.status(500).send({
              success: false,
              msg: 'Server Error',
              data: []
          })
      } else {
          res.send({
              success: true,
              msg: 'Success',
              data: result
          })
      }
  })
});


// Get categories by userId
app.get('/get_Allcategories_byId/:user_id',(req,res) => {
  const user_id = req.params.user_id;
  const query = "SELECT * FROM category WHERE user_id = ?";
  connection.query(query,user_id,(err, result) => {
      if(err){
          console.log(err);
          res.status(500).send({
              success: false,
              msg: 'Server Error',
              data: []
          })
      } else {
          res.send({
              success: true,
              msg: 'Success',
              data: result
          })
      }
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


