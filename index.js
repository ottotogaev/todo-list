const express = require('express');
const app = express();
const mongoose = require('mongoose');
// Models
const _todoTask = require('./models/todotasks')

const dotenv = require('dotenv')
dotenv.config()

app.use("/static", express.static("public"));
app.use(express.urlencoded({
  extended: true
}))
const port = process.env.PORT || 5000;


mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true
}, () => {
  console.log("Connected to db");

  app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
  });
})

app.set('view engine', 'ejs');


// Get
app.get('/', (req, res) => {

  _todoTask.find({}, (err, tasks) => {
    res.render('todo.ejs', {
      todoTasks: tasks
    });
  });

});

// POST

app.post('/', async (req, res) => {
  const todoTask = new _todoTask({
    content: req.body.content
  });

  try {
    await todoTask.save();
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
  }
});

// Update

app.route('/edit/:id').get((req, res) => {
  _todoTask.find({}, (err, tasks) => {
    const id = req.params.id;
    res.render('todoEdit.ejs', {
      todoTasks: tasks,
      idTask: id
    });
  })
}).post((req, res) => {
  const id = req.params.id;
  _todoTask.findByIdAndUpdate(id, {
    content: req.body.content
  }, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});

// Delete

app.route('/remove/:id').get((req, res) => {
  const id = req.params.id;
  _todoTask.findByIdAndRemove(id, err => {
    if(err) return res.send(500, err);
    res.redirect('/');
  })
})