var pivote = 0;
var restricciones = [];
var restriccionesFase2 = [];
var variables = [];
tipo = 'max';

function fase1(tabla) {
	//variables = ['X1', 'X2', 'S1', 'R1']
	//variables = ['X1', 'X2', 'S1','S2', 'R1']
	console.log('n-m=',(variables.length-restricciones.length), 'n',variables.length, 'm', restricciones.length)

	//sbi = ['S1', 'S2', 'R1']
	let sbi = [];
	variables.forEach(e => {
		if ((/X\d{1,}/g).test(e)) sbi.push(e);
	})

	console.log('--despues sbi', variables)



	/*tabla = [
		[0,0,0,0,-1,0],
		[1,0,1,0,0,4],
		[0,2,0,1,0,12],
		[3,2,0,0,1,18]
	];*/
	let c_rs = 0;
	
	sbi.forEach((e, index) => {
		if ((/R\d{1,}/g).test(e)) {
			c_rs += 1;
			tabla[index+1].forEach((coe, pos) => {
				tabla[0][pos] += coe;
			})
		}
	})

	console.log('Fase 1')
	console.log('Tabla Inicial:')
	tabla.forEach(fila => console.log(fila))

	let iteracion = 0;
	console.log('Variables en solucion:', sbi)
	while (!esOptimo(tabla[0], 'min')) {
		console.log('---------------------')
		v_entra = entraFase1(tabla[0]);
		v_sale = sale(tabla.slice(1, tabla.length+1), v_entra);
		//console.log('Entra', variables[v_entra])
		//console.log('Sale', sbi[v_sale])

		sbi[v_sale] = variables[v_entra]


		let filaPivote = filaPivoteNueva(tabla[v_sale+1]);
		tabla[v_sale+1] = filaPivote;

		let nuevaFila = [];

		tabla.forEach((fila, index) => {
			if (index != v_sale + 1 ) {
				filaPivote.forEach((e, j) => {
					let pivotecambiado = (((-1)*fila[v_entra])*filaPivote[j] );

					let nuevo = fila[j] + pivotecambiado;
					nuevaFila.push(nuevo);
				})
				tabla[index] = nuevaFila;
				nuevaFila = [];
			}
		})
		console.log(`Iteracion ${iteracion+1}`)
		tabla.forEach(fila => console.log(fila))
		iteracion++;
		let tablaHTML = '<table class="bg-white table table-striped table-hover">';
			tablaHTML += '<tr>'

		tabla[0].forEach((res) => {
			res[1].forEach(e => {
				tablaHTML += `<td>${e}</td>`
			})
		})
			tablaHTML += '</tr>'
		tablaHTML += '</table>';

		document.getElementById('resultado').innerHTML += tablaHTML;
	}

	sbi.forEach((e, index) => {
		console.log(tabla[index+1])
		console.log(variables)
		restriccionesFase2.push([e, tabla[index+1].filter((el, pos) => {
			return (pos < variables.indexOf('R1') || pos == variables.length);
		})])
	})

	console.log('\n\nResultado Fase 1')
	console.log('Nuevas Restricciones:')
	restriccionesFase2.forEach(fila => console.log(fila))
	restriccionesFase2.forEach(ec => console.log(ec[0], ec[1]))

	let tablaHTML = '<table class="bg-white table table-striped table-hover">';
	restriccionesFase2.forEach((res) => {
		tablaHTML += '<tr>'
		res[1].forEach(e => {
			tablaHTML += `<td>${e}</td>`
		})
		tablaHTML += '</tr>'

	})

	tablaHTML += '</table>';

	document.getElementById('resultado').innerHTML += tablaHTML;

	return (1);
}

function fase2(tabla2) {
	let sbi2 = [];

	console.log('\n\n\nFase 2')

	//elimina columas R para las nuevas restricciones
	restriccionesFase2.forEach((fila, index) => {
		sbi2.push(fila[0]);
		tabla2.push(fila[1])
		restriccionesFase2[index] = fila[1]
	})

	tabla2.forEach(fila => console.log(fila))

	//hacer 0 en z variables pertenecientes a la sbi
	let multiplicadores = [];
	tabla2[0].forEach((v, i) => {
		if (v != 0) multiplicadores.push([variables[i], -v]);
	})

	multiplicadores.forEach((v, i) => {
		let n = sbi2.indexOf(v[0]);
		let filaTemp = [];
		
		tabla2[n+1].forEach((el, j) => {
			filaTemp.push(el*v[1])
		})

		filaTemp.forEach((val, w) => {
			tabla2[0][w] += val
		})
	})

	console.log('\n\nTabla Inicial')
	tabla2.forEach(fila => console.log(fila))

	let iteracion = 0;

	while (!esOptimo(tabla2[0], tipo) && iteracion <= 99) {
		console.log('---------------------')
		v_entra = entra(tabla2[0]);
		v_sale = sale(tabla2.slice(1, tabla2.length+1), v_entra);
		//console.log('Entra', variables[v_entra])
		//console.log('Sale', sbi[v_sale])

		sbi2[v_sale] = variables[v_entra]


		let filaPivote = filaPivoteNueva(tabla2[v_sale+1]);
		tabla2[v_sale+1] = filaPivote;

		let nuevaFila = [];

		tabla2.forEach((fila, index) => {
			if (index != (v_sale + 1) ) {
				filaPivote.forEach((e, j) => {
					let pivotecambiado = (((-1)*fila[v_entra])*filaPivote[j] );

					let nuevo = fila[j] + pivotecambiado;
					nuevaFila.push(nuevo);
				})
				tabla2[index] = nuevaFila;
				nuevaFila = [];
			}
		})
		console.log(`Iteracion ${iteracion+1}`)
		tabla2.forEach(fila => console.log(fila))
		iteracion++;
	}

	console.log('\n\nTabla Optima');
	tabla2.forEach(fila => console.log(fila))
	sbi2.forEach((v, i) => {
		console.log(v, '=', tabla2[i+1][z.length-1])
	})
	console.log('Z =', tabla2[0][z.length-1])
}

//calcula la nueva fila pivote
function filaPivoteNueva(fila) {
	let nueva = [];
	fila.forEach(el => nueva.push(el/pivote));
	return nueva;
}

//identifica la variable que sale durate fase2
function entra(z) {
	let posicion, mayor;
	
	for (let i = 0; i <= z.length; i++) {
		if (tipo == 'max') {
			if (z[i] <= 0) {
				if (i == 0) {
					mayor = z[0];
					posicion = 0;
				} else if (Math.abs(mayor) < Math.abs(z[i])) {
					posicion = i;
					mayor = z[i];
				}
			}
		}
	}
	//document.getElementsByTagName('th')[posicion+1].className = 'alert-primary';
	return posicion;
}

//identifica la variable que sale
function sale(tabla, entra) {
	let posicion, valor = 1111111111;

	tabla.forEach((fila, pos) => {
		if (fila[entra] > 0) {
			if (pos == 0) {
				valor = fila[fila.length - 1] / fila[entra];
				posicion = pos;
			} else if (valor > fila[fila.length - 1] / fila[entra]) {
				posicion = pos;
				valor = fila[fila.length - 1] / fila[entra];
			}
		}
	});

	if (posicion == undefined && valor == 1111111111) {
		console.log('variable no acotada')
	}
	
	pivote = tabla[posicion][entra];

	//let trSale = document.querySelectorAll('tbody tr')[posicion+1]
	//trSale.querySelector('td').className = 'alert-danger';
	//trSale.querySelectorAll('td')[entra+1].className = 'alert-warning';

	return posicion;
}

//identifica la vaiable que durante fase 1
function entraFase1(r) {
	let posicion, mayor;
	
	for (let i = 0; i < r.length-1; i++) {
		if (r[i] >= 0) {
			if (i == 0) {
				mayor = r[0];
				posicion = 0;
			} else if (mayor <= r[i]) {
				posicion = i;
				mayor = r[i];
			}
		}
	}
	//document.getElementsByTagName('th')[posicion+1].className = 'alert-primary';
	return posicion;
}

//verifica optimidad de z o r
function esOptimo(z, obj) {
	let res = true;

	z.forEach(e => {
		if (obj == 'max') {
			if (e<0) res = false;
		} else if (obj == 'min') {
			if (e>0) res = false;
		}
	});

	return res;
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

	if (c_art > 0) {
		metodo = 1;
	} else {
		for (let w=0; w < c_hol; w++) {
			sbi.push('S'+(w+1));
		}
	}
	return modelo;
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

function calcular() {

	let modeloEstandard = estandarizar();

	alert(modeloEstandard.objetivo)

	variables = modeloEstandard.objetivo.match(/[a-zA-Z]\d{1,}/g);
	alert(variables)

	let tablaInicial = [];
	let z = []; // contiene temporalmente la fila Z de la tabla incial

	variables.forEach(v => {
		if (/R\d{1,}/.test(v)) {
			z.push(-1)
		} else {
			z.push(0)
		}
	})

	z.push(0)

	tablaInicial.push(z);

	modeloEstandard.restricciones.forEach((r, i) => {
		tablaInicial.push(getCoeficients(r)); // coeficientes de las variales
		tablaInicial[i+1].push(parseFloat(r.split(' = ')[1])); // valor solucion
	});
	alert(tablaInicial);

	if (fase1(tablaInicial)) {
		let tabla2 = [];
		let z= getCoeficients(modeloEstandard.objetivo)
		console.log('z-----', z)
		tabla2.push(z)
		tabla2[0].forEach((e, i) => {
			tabla2[0][i] = e*(-1)
		})

		
		restriccionesFase2.forEach(fila => {
			tabla2.push(fila[1]);
		})

		fase2(tabla2);
	} else {
		//
	}
}

function limpiar() {
	document.getElementById('obj-input').value = '';
	limpiarRestricciones();
}

function limpiarRestricciones() {
	document.getElementById('restriction-list').innerHTML = '';
	restricciones=[];
}

calcular()