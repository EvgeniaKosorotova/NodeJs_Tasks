function selectTransleted(e) {
	let author = document.getElementById('authorOriginal');
	let name = document.getElementById('nameOriginal');

	if (e.checked) {
		author.removeAttribute('disabled');
		name.removeAttribute('disabled');
	}
	else {
		author.value = '';
		name.value = '';
		author.setAttribute('disabled', true);
		name.setAttribute('disabled', true);
	}
}

function updateAnnotation(e) {
	document.getElementById('annotation').value = e.value.replace(/\n\r?/g, '<br />');
}

function sortTable(iconId, colNum) {
	let tbody = document.getElementById("libraryTableData");
	let rows = [...tbody.rows];
	let icon = document.getElementById(iconId).className;

	if (icon == "bi bi-sort-alpha-up") {
		rows.sort((a, b) => a.cells[colNum].textContent.localeCompare(b.cells[colNum].textContent))
			.map(row => tbody.appendChild(row));
		document.getElementById(iconId).className = "bi bi-sort-alpha-down";
	}
	else if (icon == "bi bi-sort-alpha-down") {
		rows.sort((a, b) => b.cells[colNum].textContent.localeCompare(a.cells[colNum].textContent))
			.map(row => tbody.appendChild(row));
		document.getElementById(iconId).className = "bi bi-sort-alpha-up";
	}
}

function searchBooks() {
	let str = document.getElementById('searchBook').value;
	fetch(`books?search=${str}`, {
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	}).then((res) => {
		window.location.href = `books?search=${str}`;
	}).catch(function (err) {
		console.info(err);
	});
}

function filterBooks() {
	let type = document.querySelector('input[name="types"]:checked').value;
	let select = document.getElementById('genres');
	let genre = select.options[select.selectedIndex].value;

	fetch(`books?type=${type}&genre=${genre}`, {
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	})
	.then((res) => {
		window.location.href = `books?type=${type}&genre=${genre}`;
	})
	.catch(function (err) {
		console.info(err);
	});
}

function addPenalties(logbookId) {
	fetch(`api/penalties/logbooks/${logbookId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		redirect: 'follow'
	})
	.then((res) => {
		//window.location.href = `books?type=${type}&genre=${genre}`;
	})
	.catch(function (err) {
		console.info(err);
	});
}

function deletePenaltiesByLogbook(logbookId) {
	fetch(`api/penalties/logbooks/${logbookId}?_method=DELETE`, {
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		redirect: 'follow'
	})
	.then((res) => {
		//window.location.href = `books?type=${type}&genre=${genre}`;
	})
	.catch(function (err) {
		console.info(err);
	});
}