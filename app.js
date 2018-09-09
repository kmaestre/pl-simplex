let restrictions = [];

let tablaRes = [];
let obajective = document.getElementById('obj-input').value

function addRestriction(e) {
	let res = document.getElementById('restriction-input').value;
	if (res == '') return

	restrictions.push(splitRestriction(res))
	getCoeficients(restrictions[0][1].rightHand)

	console.log(restrictions)
	document.getElementById('restriction-list').innerHTML += `<li class="list-group-item"><code>${res}</code></li>`
}

function splitRestriction(res) {
	if (res.match(' = ')) {
		let splited = res.split(' = ')
		return ['=', {
			rightHand:  splited[0], leftHand:  splited[1]
		}]
	}
	if (res.match(' >= ')) {
		let splited = res.split(' >= ')
		return ['>=', {
			rightHand:  splited[0], leftHand:  splited[1]
		}]
	};
	if (res.match(' <= ')) {
		let splited = res.split(' <= ')
		return ['<=', {
			rightHand:  splited[0], leftHand:  splited[1]
		}]
	};
}

function getCoeficients(exp) {
	let expTree = exp.split(/(\+)|(\-)/g);
	let coe = [];

	exp.split(/[a-zA-Z]/g).forEach(el => coe.push(parseInt(el)));

	console.log(expTree);
	console.log(coe);

	let res = [];
	tablaRes.push(coe)

	expTree.forEach(term => {
		if (term != undefined && term != '') res.push(term)
	});

	return (res)
}
