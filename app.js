let restricciones = [];
let soluciones = [];
let tablaRes = [];
let objectivo = document.getElementById('obj-input').value

function addRestriction(e) {
	let res = document.getElementById('restriction-input').value;
	if (res == '') return

	restricciones.push(splitRestriction(res))
	getCoeficients(restricciones[restricciones.length -1][1].rightHand)
	soluciones.push(restricciones[restricciones.length -1][1].leftHand)

	//console.log(restricciones)
	document.getElementById('restriction-list').innerHTML += `<li class="list-group-item"><code>${res}</code></li>`
}

function splitRestriction(res) {
	if (/\s=\s/.test(res)) {
		let splited = res.split(' = ')
		return ['=', {
			rightHand:  splited[0], leftHand:  splited[1]
		}]
	} else if(/\s>=\s/.test(res)) {
		let splited = res.replace(' ', '-s ').split(' >= ')
		return ['>=', {
			rightHand:  splited[0], leftHand:  splited[1]
		}]
	} else if(/\s<=\s/.test(res)) {
		let splited = res.replace(' ', '+s ').split(' <= ')
		return ['<=', {
			rightHand:  splited[0], leftHand:  splited[1]
		}]
	} else {
		return 1;
	}
}

//.match(/((\+|\-)\d{0,}[a-z])|(\d{0,}[a-z])/g)

function getCoeficients(exp) {
	let expTree = exp.split(/(\+)|(\-)/g);
	let coe = [];

	//console.log(expTree);
	//console.log(exp.match(/((\+|\-)\d{0,}[a-z])|(\d{0,}[a-z])/g))

	exp.match(/((\+|\-)\d{0,}[a-z])|(\d{0,}[a-z])/g).forEach((el, index) => {
		//console.log(el, index)
		if (el.match(/\-[a-zA-Z]/g)) {
			coe.push(-1)
		} else {
			coe.push(parseFloat(el) ? parseFloat(el) : 1)
		}
	});

	//console.log(coe);

	tablaRes.push(coe)

}


function verCoeficientes() {
	for (row of tablaRes) console.log(row)
}

function crearTabla() {
	let tabla = document.getElementById('tabla');

	let body = tabla.querySelector('tbody');


	tablaRes.forEach((el, i) => {
		let tr = document.createElement('tr');
		tr.innerHTML = '<td>var</td>'
		el.forEach((el) => {
			tr.innerHTML += `<td>${el}</td>`
		});
		
		tr.innerHTML += `<td>${soluciones[i]}</td>`
		body.appendChild(tr)
	});

}