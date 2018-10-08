
let tipo = 'min'
let variablesRea = [];
let variablesHol = [];
let variablesArt = [];
let restricciones = [];
let soluciones = [];
let tablaRes = [];
let modeloEstandard;

function simplex() {
	let objetivo = document.getElementById('obj-input').value
	
  modeloEstandard = {
		tipo: document.getElementById('tipo').value,
		objetivo: [],
		restricciones: [],
		varDecision: [],
		varHolgura: [],
		varArtificiales: [],
	}

	variablesRea = objetivo.match(/[X]\d{1,}/g)

	variablesHol.forEach(s => {
		objetivo += ' + 0'+s;
		modeloEstandard.varHolgura.push(s)
	});

	variablesArt.forEach(r => {
		objetivo += ' + 0'+r;
		modeloEstandard.varArtificiales.push(r)
	})

	getCoeficients(objetivo).forEach(el => {
		(el == 0) ? modeloEstandard.objetivo.push(0) : modeloEstandard.objetivo.push(el*(-1))
	})

	modeloEstandard.funcionObjetivo = objetivo;

}

function addRestriction(e) {
	let input =  document.getElementById('restriction-input');
	let res = input.value;

	if (res == '') return

	restricciones.push(splitRestriction(res))
	tablaRes.push(getCoeficients(restricciones[restricciones.length -1][1].rightHand))
	soluciones.push(restricciones[restricciones.length -1][1].leftHand)
	input.value = '';

	//console.log(restricciones)
	document.getElementById('restriction-list').innerHTML += `<li class="list-group-item"><code>${res}</code></li>`
}

function splitRestriction(res) {
	if (/\s=\s/.test(res)) {

		let splited = res.replace(' ', `+R${variablesArt.length+1} `).split(' = ')
		variablesArt.push(`R${variablesArt.length+1}`)
		return ['=', { rightHand:  splited[0], leftHand:  splited[1]}]

	} else if(/\s>=\s/.test(res)) {

		let splited = res.replace(' ', `-S${variablesHol.length+1}+R${variablesArt.length+1} `).split(' >= ');
		variablesHol.push(`S${variablesHol.length+1}`)
		variablesArt.push(`R${variablesArt.length+1}`)
		return ['>=', { rightHand:  splited[0], leftHand:  splited[1]}]

	} else if(/\s<=\s/.test(res)) {

		let splited = res.replace(' ', `+S${variablesHol.length+1} `).split(' <= ')
		variablesHol.push(`S${variablesHol.length+1}`)
		return ['<=', { rightHand:  splited[0], leftHand:  splited[1]}]

	} else {
		return;
	}
}

function getCoeficients(exp) {
	//console.log(exp)
	let expTree = exp.split(/(\+)|(\-)/g);
	//console.log(expTree)
	let coe = [];

	//console.log(expTree);
	//console.log(exp.match(/((\+|\-)\d{0,}[a-z])|(\d{0,}[a-z])/g))

	exp.match(/((\+|\-){0,}\d{0,}[a-zA-Z]\d{1,})/g).forEach((el, index) => {
		//console.log(el, index)
		if (el.match(/\-[a-zA-Z]\d{1,}/g)) {
			coe.push(-1)
		} else {
			let val = parseFloat(el)

			if ((/\d/g).test(val)) {
				coe.push(val == 0 ? 0 : val)
			} else {
				coe.push(1)
			}
		}
	});

	//console.log(coe);

	return coe;

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