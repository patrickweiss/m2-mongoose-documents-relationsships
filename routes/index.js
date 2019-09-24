const express = require("express");
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/books', (req, res, next) => {
  Book.find()
    .then(allTheBooksFromDB => {
      // console.log('Retrieved books from DB:', allTheBooksFromDB);
      res.render('books', { books: allTheBooksFromDB });
    })
    .catch(error => {
      console.log('Error while getting the books from the DB: ', error);
    })
});
/*
router.get('/book/:bookId', (req, res, next) => {
  Book.findOne({ '_id': req.params.bookId })
    .then(theBook => {
      res.render('book-details', { book: theBook });
    })
    .catch(error => {
      console.log('Error while retrieving book details: ', error);
    })
});
*/
router.get('/book/:id', (req, res, next) => {
  let bookId = req.params.id;
  if (!/^[0-9a-fA-F]{24}$/.test(bookId)) { 
    return res.status(404).render('not-found');
  }
  Book.findOne({'_id': bookId})
    .populate('author')
    .then(book => {
      if (!book) {
          return res.status(404).render('not-found');
      }
      res.render("book-details", { book })
    })
    .catch(next)
});


router.get("/books/add", (req, res, next) => {
  res.render("book-add");
});
router.post("/books/add", (req, res, next) => {
  const { title, author, description, rating } = req.body;
  const newBook = new Book({ title, author, description, rating });
  newBook
    .save()
    .then(book => {
      res.redirect("/books");
    })
    .catch(error => {
      console.log(error);
    });
});
router.post("/books/edit", (req, res, next) => {
  const { title, author, description, rating } = req.body;
  Book.update(
    { _id: req.query.book_id },
    { $set: { title, author, description, rating } }
  )
    .then(book => {
      res.redirect("/books");
    })
    .catch(error => {
      console.log(error);
    });
});

// later: Mongoose & Express Documents Relationships

router.get('/authors/add', (req, res, next) => {
  res.render("author-add")
});

router.post('/authors/add', (req, res, next) => {
  const { name, lastName, nationality, birthday, pictureUrl } = req.body;
  const newAuthor = new Author({ name, lastName, nationality, birthday, pictureUrl})
  newAuthor.save()
  .then((book) => {
    res.redirect('/books')
  })
  .catch((error) => {
    console.log(error)
  })
});
/*
router.post('/reviews/add', (req, res, next) => {
  const { user, comments } = req.body;
  Book.update({ _id: req.query.book_id }, { $push: { reviews: { user, comments }}})
  .then(book => {
    res.redirect('/books')
  })
  .catch((error) => {
    console.log(error)
  })
});
*/
router.post('/reviews/add', (req, res, next) => {
  const { user, comments } = req.body;
  Book.update({ _id: req.query.book_id }, { $push: { reviews: { user, comments }}})
  .then(book => {
    res.redirect('/book/'+req.query.book_id)
  })
  .catch((error) => {
    console.log(error)
  })
});


module.exports = router;
