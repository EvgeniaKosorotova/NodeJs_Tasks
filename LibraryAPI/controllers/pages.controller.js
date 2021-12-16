const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const userService = require('../services/user.service');
const roleService = require('../services/role.service');
const genreService = require('../services/genre.service');
const bookService = require('../services/book.service');
const bookGenreService = require('../services/bookGenre.service');
const penaltyService = require('../services/penalty.service');

router.get('/login', login);
router.get('/', authorize, renderHome);
router.get('/users', authorize, renderUsers);
router.get('/users/:id/penalties', authorize, renderPenaltiesByUserId);
router.get('/books', authorize, renderBooks);
router.get('/books/:id', authorize, renderBook);

module.exports = router;

function login(req, res) {
	let alert = undefined;
	let input = undefined;

	if (req.session && req.session.flash && req.session.flash.length > 0) {
		alert = req.session.flash.find(x => x.type === "alert").message;
		input = req.session.flash.find(x => x.type === "input").message;
		req.session.flash = [];
	}

	res.render('login', {
		alert,
		input
	});
}

async function renderHome(req, res, next) {
	if (req.isAdmin) {
		res.redirect("/users");
	}
	else {
		res.redirect("/books");
	}
}

async function renderUsers(req, res) {
	if (req.isAdmin) {
		let alert = undefined;
		let input = undefined;

		if (req.session && req.session.flash && req.session.flash.length > 0) {
			alert = req.session.flash.find(x => x.type === "alert").message;
			input = req.session.flash.find(x => x.type === "input").message;
			req.session.flash = [];
		}

		let users = await userService.getAll();
		let roles = await roleService.getAll();

		res.render('pages.admin/users', {
			alert,
			input,
			users,
			roles,
			isAdmin: req.isAdmin
		});
	}
	else {
		res.redirect("/");
	}
}

async function renderPenaltiesByUserId(req, res) {
	if (req.isAdmin) {
		let penalties = await penaltyService.getByUserId(req.params.id);
		let user = await userService.getById(req.params.id);

		res.render('pages.admin/penalties', {
			penalties,
			user,
			isAdmin: req.isAdmin
		});
	}
	else {
		res.redirect("/");
	}
}

async function renderBooks(req, res) {
	if (req.isAdmin) {
		let alert = undefined;
		let input = undefined;

		if (req.session && req.session.flash && req.session.flash.length > 0) {
			alert = req.session.flash.find(x => x.type === "alert").message;
			input = req.session.flash.find(x => x.type === "input").message;
			req.session.flash = [];
		}

		let books = await bookService.getAll();
		let genres = await genreService.getAll();
		let bookGenres = await bookGenreService.getAll();

		res.render('pages.admin/books', {
			alert,
			input,
			books,
			genres,
			bookGenres,
			isAdmin: req.isAdmin
		});
	}
	else {
		if (req.query.search !== undefined && req.query.search.length > 0) {
			await searchBooks(req, res);
		}
		else if (req.query.genre !== undefined && req.query.type !== undefined) {
			await filterBooks(req, res);
		}
		else {
			await renderLibrary(req, res);
		}
	}
}

async function renderLibrary(req, res) {
	if (!req.isAdmin) {
		let books = await bookService.getAll();
		let genres = await genreService.getAll();

		res.render('pages.user/books', {
			books,
			genres,
			search: '',
			filter: {
				genre: 0,
				type: 0
			},
			isAdmin: req.isAdmin
		});
	}
	else {
		res.redirect("/books");
	}
}

async function searchBooks(req, res) {
	if (!req.isAdmin) {
		let books = await bookService.searchByAuthorOrName(req.query.search);
		let genres = await genreService.getAll();

		res.render('pages.user/books', {
			books,
			genres,
			search: req.query.search,
			filter: {
				genre: 0,
				type: 0
			},
			isAdmin: req.isAdmin
		});
	}
	else {
		res.redirect("/books");
	}
}

async function filterBooks(req, res) {
	if (!req.isAdmin) {
		let books = await bookService.filterByGenresAndType(req.query.genre, req.query.type, req.user.id);
		let genres = await genreService.getAll();

		res.render('pages.user/books', {
			books,
			genres,
			search: '',
			filter: {
				genre: req.query.genre,
				type: req.query.type
			},
			isAdmin: req.isAdmin
		});
	}
	else {
		res.redirect("/books");
	}
}

async function renderBook(req, res) {
	if (!req.isAdmin) {
		let penalties = await penaltyService.getByUserId(req.user.id);
		let book = await bookService.getById(req.params.id);
		let isCurrentBook = false;
		let isFreeBook = true;

		if (book.logbooks.length > 0) {
			let logbook = book.logbooks.filter(x => x.isReturned === false);

			if (logbook.length > 0) {
				isFreeBook = false;
				let logbookByUser = book.logbooks.filter((x) => x.userId === req.user.id && x.isReturned === false);

				if (logbookByUser.length > 0) {
					isCurrentBook = true;
				}
			}
		}
		
		res.render('pages.user/book', {
			book,
			isFreeBook,
			isCurrentBook,
			hasPenalties: penalties.length > 0,
			userId: req.params.id,
			isAdmin: req.isAdmin
		});
	}
	else {
		res.redirect("/books");
	}
}

module.exports = router;