let tipo = 'min'
let variablesRea = [];
let variablesHol = [];
let variablesArt = [];
let restricciones = [];
let soluciones = [];
let tablaRes = [];
let modeloEstandard;

//
function simplex() {
	let objetivo = document.getElementById('obj-input').value
	
	
	let modelo = estandarizar();

	let tablaInicial = [];

	let z = []; // contiene temporalmente la fila Z de la tabla incial

	getCoeficients(modelo.objetivo).forEach(e => {
		z.push(e*(-1));
	});
	z.push(0)

	tablaInicial.push(z);

	modelo.restricciones.forEach((r, i) => {
		tablaInicial.push(getCoeficients(r)); // coeficientes de las variales
		tablaInicial[i+1].push(r.split(' = ')[1]); // valor solucion
	});

	// Crear cabecera de la tabla
	// con variables en funcion objetivo
	let variables = modelo.objetivo.match(/[a-zA-Z]\d{1,}/g);

	let cabecera = document.getElementById('cabecera');
	cabecera.innerHTML = '<th>VB</th>';

	variables.forEach(x => {
		cabecera.innerHTML += '<th>' + x + '</th>';
	})

	cabecera.innerHTML += '<th>Sol</th>'

	// Seleccionar variables Basicas
	// Crear columna de variables basicas
	let tabla = document.getElementById('tbody');
	tabla.innerHTML = '';

	tablaInicial.forEach((fila, i) => {
		let filaHtml = (i == 0) ? `<tr><td>Z</td>` : `<tr><td>S${i}</td>`;
		
		fila.forEach(coe => {
			filaHtml += '<td>' + coe + '</td>';
		});

		tabla.innerHTML += filaHtml + '</tr>';
	});

	var v_entra = entra(tablaInicial[0]);
	var v_sale = sale(tablaInicial.slice(1, tablaInicial.length+1), v_entra);
}

function sale(tabla, entra) {
	console.log(tabla, entra);
	tabla.forEach(fila => console.log(fila[fila.length-1]));

	let posicion, valor;

	for (let i = 0; i <= tabla.length; i++) {
		if (i == 0) {
			valor = tabla[i][tabla[i].length] / tabla[i][tabla[entra]];
			posicion = i;
		} else if (valor > tabla[i][tabla[i].length] / tabla[i][tabla[entra]]) {
			posicion = i;
			valor = tabla[i][tabla[i].length] / tabla[i][tabla[entra]];
		}
	}
	//document.getElementsByTagName('th')[posicion+1].style.backgroundColor = 'red';
	console.log('sale', posicion)
	return posicion;
}

//identifica la vaiable que entra
function entra(z) {
	let posicion, mayor;
	
	for (let i = 0; i <= z.length; i++) {
		if (i == 0) {
			mayor = z[i];
			posicion = i;
		} else if (Math.abs(mayor) < Math.abs(z[i])) {
			posicion = i;
			mayor = z[i];
		}
	}
	document.getElementsByTagName('th')[posicion+1].style.backgroundColor = 'red';
	return posicion;
}

// Metodo para agregar una restriccion al arreglo de restricciones
function agregarRestriccion(e) {
	let input =  document.getElementById('restriction-input');
	let res = input.value;

	if (res == '' || (/(\s=\s)|(\s>=\s)|(\s<=\s)/g).test(res) == false) return

	restricciones.push(res);
	//tablaRes.push(getCoeficients(restricciones[restricciones.length -1][1].rightHand))
	//soluciones.push(restricciones[restricciones.length -1][1].leftHand)
	input.value = '';

	document.getElementById('restriction-list').innerHTML += `<li class="list-group-item"><code>${res}</code></li>`
}

// Metodo para transformar el modelo de PL a su forma Estandard
function estandarizar() {
	let c_restricciones = restricciones.length; // cantidad de restricciones
	let v_artificiales = 0;	// contador de variables artificiales
	let v_holgura = 0;	// contdor variables de holgura


	let modelo = { // Objeto de Modelo estandard.
		tipo: document.getElementById('tipo').value,
		objetivo: document.getElementById('obj-input').value,
		restricciones: [],
	};

	// determina catidad de cada tipo de variable
	restricciones.forEach((res) => {
		if (/\s=\s/g.test(res)) {
			v_artificiales += 1;
			modelo.objetivo += '+0R'+v_artificiales;
		} else if (/\s<=\s/g.test(res)) {
			v_holgura += 1;
			modelo.objetivo += '+0S'+v_holgura;
		} else if (/\s>=\s/g.test(res)) {
			v_holgura += 1;
			v_artificiales += 1;
			modelo.objetivo += '+0R'+v_artificiales;
			modelo.objetivo += '+0S'+v_holgura;
		}
	});

	let c_art = 0; // contador de variables artificiales agregadas
	let c_hol = 0; // contador de variables de holgura agregadas

	restricciones.forEach((res) => {
		let estandard = res;
		
		// agrega variables de holgura a la restriccion
		for (let i = 1; i <= v_holgura; i++) {
			estandard = estandard.replace(' ', ('+0S'+ i + ' '));
		}

		// agrega variables artificiales a la restriccion
		for (let j = 1; j <= v_artificiales; j++) {
			estandard = estandard.replace(' ', ('+0R'+ j + ' '));
		}

		// cambia el coeficiente de las variables de exceso y holgura correspondintes a la retriccion
		if (/\s=\s/g.test(estandard)) {
			estandard = estandard.replace('0R'+ (c_art+1), '1R'+ (c_art+1) );
			c_art += 1;
		} 

		if (/\s<=\s/g.test(estandard)) {
			estandard = estandard.replace('0S'+ (c_hol+1), '1S'+ (c_hol+1) );
			c_hol += 1;
		} 

		if (/\s>=\s/g.test(estandard)) {
			estandard = estandard.replace('0R'+ (c_art+1), '1R'+ (c_art+1) );
			c_art += 1;
			estandard = estandard.replace('+0S'+ (c_hol+1), '-1S'+ (c_hol+1) );
			c_hol += 1;
		}

		estandard = estandard.replace(/=|>=|<=/g, '='); // cambia desigualdad por '='

		modelo.restricciones.push(estandard); // agrega la restriccion en forma estandard al modelo
	})

	/*
	console.log('restricciones:', c_restricciones),
	console.log('holgura:', v_holgura);
	console.log('artificial:', v_artificiales);
	console.log('\n----- Modelo Estandard ------');
	console.log(modelo.tipo,'Z =', modelo.objetivo);
	console.log('Sujeto a:');
	modelo.restricciones.forEach(r => console.log(r));
	*/
	return modelo;
}

// Metodo para extraer los coeficientes de una expresion
function getCoeficients(exp) {
	let expTree = exp.split(/(\+)|(\-)/g);
	let coe = [];

	exp.match(/((\+|\-){0,}\d{0,}[a-zA-Z]\d{1,})/g).forEach((el, index) => {
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