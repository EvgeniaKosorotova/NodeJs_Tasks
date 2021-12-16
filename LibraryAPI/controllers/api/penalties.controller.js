const express = require('express');
const router = express.Router();
const authorize = require('../../middleware/authorize');
const penaltyService = require('../../services/penalty.service');
const logbookService = require('../../services/logbook.service');

router.post('/logbooks/:id', authorize, create);
router.delete('/logbooks/:id', authorize, deleteByLogbookId);

module.exports = router;

async function create(req, res) {
	await penaltyService.create({ 
		logbookId: req.params.id
	});
	let logbook = await logbookService.getById(req.params.id);

	res.redirect(`/users/${logbook.userId}/penalties`);
}

async function deleteByLogbookId(req, res, next) {
	await penaltyService.deleteByLogbook(req.params.id);
	let logbook = await logbookService.getById(req.params.id);

	res.redirect(`/users/${logbook.userId}/penalties`);
}