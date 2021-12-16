const express = require('express');
const router = express.Router();
const authorize = require('../../middleware/authorize');
const logbookService = require('../../services/logbook.service');

router.post('/books/:id/options/:type', authorize, takeBook);
router.put('/books/:id', authorize, returnBook);

module.exports = router;

async function takeBook(req, res, next) {
	logbookService.create({ 
		userId: req.user.id, 
		bookId: req.params.id, 
		isHome: req.params.type
	})
	.then(() => res.redirect(`/books/${req.params.id}`))
	.catch(next);
}

async function returnBook(req, res) {
	logbookService.update({ 
		userId: req.user.id, 
		bookId: req.params.id, 
		isReturned: 1
	})
	.then(() => res.redirect(`/books/${req.params.id}`))
	.catch(next);
}