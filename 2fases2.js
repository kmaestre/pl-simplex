var pivote = 0;
var restricciones = [];
var restriccionesFase2 = [];
var z = [-2, -3, 0, 0];
var modeloEstandard;
tipo = 'max';

function fase1(tabla) {
	//variables = ['X1', 'X2', 'S1', 'R1']
	//variables = ['X1', 'X2', 'S1','S2', 'R1']
	//sbi = ['S1', 'R1']
	//sbi = ['S1', 'S2', 'R1']
	// tabla = [
	// 	[0,0,0,-1,0],
	// 	[1,2,1,0,4],
	// 	[1,1,0,1,3]
	// ];
	/*tabla = [
		[0,0,0,0,-1,0],
		[1,0,1,0,0,4],
		[0,2,0,1,0,12],
		[3,2,0,0,1,18]
  ];*/
  
  let sbi = [];
	variables.forEach(e => {
		if ((/X\d{1,}/g).test(e) == false) sbi.push(e);
	})

	let c_rs = 0;
	
	sbi.forEach((e, index) => {
		if ((/R\d{1,}/g).test(e)) {
			c_rs += 1;
			tabla[index+1].forEach((coe, pos) => {
				tabla[0][pos] += coe;
			})
		}
	})

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
	}

	sbi.forEach((e, index) => {
		restriccionesFase2.push([e, tabla[index+1].filter((el, pos) => {
			return (pos < variables.indexOf('R1') || pos == variables.length);
		})])
	})

	console.log('\n\nResultado Fase 1')
  console.log('Nuevas Restricciones:')
  console.log(sbi)
  console.log(restriccionesFase2)
	//restriccionesFase2.forEach(ec => console.log(ec[0], ec[1]))

	return (1);
}

function fase2(tabla) {
	let tabla2 = [z]
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
			if (index != v_sale + 1 ) {
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
	let v_holgura = 0;	// contador variables de holgura


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
  modeloEstandard = estandarizar();
  variables = modeloEstandard.objetivo.match(/[a-zA-z]\d{1,}/g)
  console.log(variables)
  console.log('Modelo:')
  console.log(modeloEstandard)
  let tabla = [];

  //tabla.push(getCoeficients(modeloEstandard.objetivo))
  let z1 = [];
  variables.forEach((v, i) => {
    if ((/R\d{1,}/g).test(v)) {
      z1.push(-1)
    } else {
      z1.push(0)
    }
  });
  z1.push(0)
  tabla.push(z1)

  modeloEstandard.restricciones.forEach(res =>  {
    tabla.push(getCoeficients(res));
    tabla[tabla.length-1].push(parseFloat(res.split('=')[1]))
  });


  console.log(tabla);
  let tabla2 = [];
  if (fase1(tabla)) {
		//tabla2.push(z);

		fase2([]);
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