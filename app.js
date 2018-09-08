function addRestriction(e) {
	let res = document.getElementById('restriction-input').value;
	if (res == '') return
	document.getElementById('restriction-list').innerHTML += `<li class="list-group-item"><code>${res}</code></li>`
}