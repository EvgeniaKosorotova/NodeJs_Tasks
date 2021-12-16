const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authorize = require('../../middleware/authorize');
const bookService = require('../../services/book.service');
const bookGenreService = require('../../services/bookGenre.service');

router.post('/create', authorize, createSchema(), create);
router.delete('/:id', authorize, _delete);

module.exports = router;

function createSchema() {
	return [
		check('author', 'Автор может быть длиной 3-255 символов.')
			.notEmpty()
			.isLength({ min: 3, max: 255 }),
		check('name', 'Название может быть длиной 3-255 символов.')
			.notEmpty()
			.isLength({ min: 3, max: 255 }),
		check('annotation', 'Аннотация может быть длиной 3-500 символов.')
			.notEmpty()
			.isLength({ min: 3, max: 500 }),
		check('genres', 'Хотя бы 1 жанр должен быть выбран.')
			.notEmpty(),
		check('authorOriginal', 'Аннотация может быть длиной до 255 символов.')
			.isLength({ max: 255 }),
		check('nameOriginal', 'Аннотация может быть длиной до 255 символов.')
			.isLength({ max: 255 })
	]
}

async function create(req, res) {
	let errors = validationResult(req);

	if (!errors.isEmpty()) {
		let alert = errors.array();
		req.flash('alert', alert);
		req.flash('input', {
			author: req.body.author, 
			name: req.body.name, 
			annotation: req.body.annotation,
			genres: req.body.genres,
			isTranslated: req.body.isTranslated ? req.body.isTranslated : false,
			authorOriginal: req.body.authorOriginal ? req.body.authorOriginal : '',
			nameOriginal: req.body.nameOriginal ? req.body.nameOriginal : '',
			isOnlyReadingRoom: req.body.isOnlyReadingRoom ? req.body.isOnlyReadingRoom : false
		});

		res.redirect("/books");
	}
	else {
		let book = await bookService.create(req.body);

		for (let genre of req.body.genres) {
			await bookGenreService.create({
				bookId: book.id,
				genreId: genre
			});
		}

		res.redirect("/books");
	}
}

function _delete(req, res, next) {
	bookService.delete(req.params.id)
		.then(() => res.redirect("/books"))
		.catch(next);
}