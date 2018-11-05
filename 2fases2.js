var pivote = 0;
var restricciones = [];
var restriccionesFase2 = [];
//var z = [-2, -3, 0, 0];
var modeloEstandard;
var artificiales = [];
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
	variables.forEach((e, i) => {
		if (i >= (variables.length - restricciones.length)) sbi.push(e)
	})
	console.log(sbi)
	let c_rs = 0;
	
	sbi.forEach((e, index) => {
		if ((/R\d{1,}/g).test(e)) {
			c_rs += 1;
			tabla[index+1].forEach((coe, pos) => {
				tabla[0][pos] += coe;
			})
			console.log(tabla[index+1])
		}
	});

	document.getElementById('titulo1').style.display = 'block';
	document.querySelector('#tabla1 #cabecera').innerHTML = '<th>VB</th>'


	variables.forEach(v => {
		let th = document.createElement('th');
		th.innerText = v;
		document.querySelector('#tabla1 #cabecera').appendChild(th)
	})

	document.querySelector('#tabla1 #cabecera').innerHTML += '<th>Sol</th>'
	console.log('Tabla Inicial:')
	tabla.forEach(fila => console.log(fila))
	tabla.forEach((fila, i) => {
		let tr = document.createElement('tr');
		if (i == 0) {
			tr.style.background = 'grey'
			tr.style.color = 'white'
			tr.innerHTML += '<td>R</td>'
		} else {
			tr.innerHTML += '<td>'+sbi[i-1]+'</td>'
		}

		fila.forEach(e => tr.innerHTML += '<td>'+e+'</td>')
		document.querySelector('#tabla1 #tbody').appendChild(tr);
	})

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
		tabla.forEach((fila, i) => {
			let tr = document.createElement('tr');
			if (i == 0) {
				tr.style.background = 'grey'
				tr.style.color = 'white'
				tr.innerHTML += '<td>R</td>'
			} else {
				tr.innerHTML += '<td>'+sbi[i-1]+'</td>'
			}

			fila.forEach(e => tr.innerHTML += '<td>'+e+'</td>')
			document.querySelector('#tabla1 #tbody').appendChild(tr);
		})

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
	let z = getCoeficients(modeloEstandard.objetivo)
	z.forEach((e, i) => {
		if (e != 0) z[i] = e*(-1);
	})

	let tabla2 = [z]
	let sbi2 = [];
	variables = variables.filter(v => !(/R\d{1,}/g).test(v));
	console.log('\n\n\nFase 2')

	document.getElementById('titulo2').style.display = 'block';

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
	document.querySelector('#tabla2 #cabecera').innerHTML = '<td>VB</td>';
	variables.forEach(e => {
		let th = document.createElement('th');
		th.innerText = e;
		document.querySelector('#tabla2 #cabecera').appendChild(th);
	})
	document.querySelector('#tabla2 #cabecera').innerHTML += '<td>Sol</td>';

	tabla2.forEach((fila, i) => {
		let tr = document.createElement('tr');
		if (i == 0) {
			tr.style.background = 'grey'
			tr.style.color = 'white'
			tr.innerHTML += '<td>Z</td>'
		} else {
			tr.innerHTML += '<td>'+sbi2[i-1]+'</td>'
		}

		fila.forEach(e => tr.innerHTML += '<td>'+e+'</td>')
		document.querySelector('#tabla2 #tbody').appendChild(tr);
	})

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
		tabla2.forEach((fila, i) => {
			let tr = document.createElement('tr');
			if (i == 0) {
				tr.style.background = 'grey'
				tr.style.color = 'white'
				tr.innerHTML += '<td>Z</td>'
			} else {
				tr.innerHTML += '<td>'+sbi2[i-1]+'</td>'
			}

			fila.forEach(e => tr.innerHTML += '<td>'+e+'</td>')
			document.querySelector('#tabla2 #tbody').appendChild(tr);
		})
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
		switch(document.getElementById('tipo').value){
			case 'max':
				if (z[i] <= 0) {
					if (i == 0) {
						mayor = z[0];
						posicion = 0;
					} else if (Math.abs(mayor) < Math.abs(z[i])) {
						posicion = i;
						mayor = z[i];
					}
				}break;
			case 'min':
				if (z[i] >= 0) {
					if (i == 0) {
						mayor = z[0];
						posicion = 0;
					} else if (Math.abs(mayor) < Math.abs(z[i])) {
						posicion = i;
						mayor = z[i];
					}
				}break;
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
	artificiales = [];

	// determina catidad de cada tipo de variable
	restricciones.forEach((res) => {
		if (/\s=\s/g.test(res)) {
			v_artificiales += 1;
			modelo.objetivo += '+0R'+v_artificiales;
			artificiales.push('R'+v_artificiales)
		} else if (/\s<=\s/g.test(res)) {
			v_holgura += 1;
			modelo.objetivo += '+0S'+v_holgura;
		} else if (/\s>=\s/g.test(res)) {
			v_holgura += 1;
			v_artificiales += 1;
			modelo.objetivo += '+0R'+v_artificiales;
			modelo.objetivo += '+0S'+v_holgura;
			artificiales.push('R'+v_artificiales)
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

	let sbi = [];
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
  tipo = document.getElementById('tipo').value

  let ths = document.querySelectorAll('#cabecera');
  ths.forEach(thr => {thr.innerHTML = ''})
  variables =  null;
  variables = modeloEstandard.objetivo.match(/(X\d{1,})|(S\d{1,})/g)

  variables = variables.concat(artificiales)

  alert(variables);

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

  if (artificiales.length > 0) {
  	if (fase1(tabla)) {
		//tabla2.push(z);

		fase2([]);
		} else {
			alert('no se pudo resolver el problema')
		}	
  }
   else {
   	tabla[0] = getCoeficients(modeloEstandard.objetivo);
   	tabla[0].forEach((e, i) => tabla[0][i] = (e!=0) ?  e*(-1) : e)
   	tabla[0].push(0);
		calcularSimplex(tabla);
	}
}

// SIMPLEX -----------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
let tipoSimplex = 'min'
let variablesReaSimplex = [];
let variablesHolSimplex = [];
let variablesArtSimplex = [];
let solucionesSimplex = [];
let tablaResSimplex = [];
let modeloEstandardSimplex;
let v_entraSimplex;
let v_saleSimplex;
let sbiSimplex = [];
let metodoSimplex = 0;
let optimoSimplex = false;

//
function simplex(tablaInicial) {

	// Seleccionar variables Basicas
	// Crear columna de variables basicas
	let tablaSimplex = document.getElementById('tbody');
	tablaSimplex.innerHTML = '';

	tablaInicial.forEach((fila, i) => {
		let filaHtml = (i == 0) ? `<tr style="background-color: darkgrey; color: white;"><td>Z</td>` : `<tr><td>S${i}</td>`;
		
		fila.forEach(coe => {
			filaHtml += '<td>' + coe + '</td>';
		});

		tablaSimplex.innerHTML += filaHtml + '</tr>';
	});

	console.log(tablaInicial);

	let i = 0;
	while (optimoSimplex == false) {
		console.log('---------------------')
		v_entraSimplex = entraSimplex(tablaInicial[0]);
		v_saleSimplex = saleSimplex(tablaInicial.slice(1, tablaInicial.length+1), v_entraSimplex);
		sbiSimplex[v_saleSimplex] = document.getElementsByTagName('th')[v_entraSimplex+1].innerText;
		let filaPivote = filaPivoteNuevaSimplex(tablaInicial[v_saleSimplex+1]);
		console.log('pivote', tablaInicial[v_saleSimplex+1])
		tablaInicial[v_saleSimplex+1] = filaPivote;

		let nuevaFila = [];

		tablaInicial.forEach((fila, index) => {
			if (index != v_saleSimplex + 1 ) {
				filaPivote.forEach((e, j) => {
					let pivotecambiado = (((-1)*fila[v_entraSimplex])*filaPivote[j] );

					let nuevo = fila[j] + pivotecambiado;
					nuevaFila.push(nuevo);
				})
				tablaInicial[index] = nuevaFila;
				nuevaFila = [];
			}
		})

		crearTablaSimplex(tablaInicial, i);	
		console.log(sbiSimplex)
		i++;
		optimoSimplex = esOptimoSimplex(tablaInicial[0]);
	}

	if (optimoSimplex) {
		console.log('Se encontro una solucion optima')
		sbiSimplex.forEach((v, index) => {
			if (/X\d{1,}/.test(v)) console.log(v+':', tablaInicial[index+1][tablaInicial[0].length - 1]);
		})
	}
}

function esOptimoSimplex(z) {
	let res = true;

	z.forEach(e => {
		if (document.getElementById('tipo').value == 'max') {
			if (e<0) res = false;
		} else if (document.getElementById('tipo').value == 'min') {
			if (e>0) res = false;
		}
	});

	return res;
}

function filaPivoteNuevaSimplex(fila) {
	let nueva = [];
	fila.forEach(el => nueva.push(el/pivoteSimplex));
	return nueva;
}

function saleSimplex(tabla, entra) {
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
		alert('variable no acotada')
	}
	
	pivoteSimplex = tabla[posicion][entra];

	//let trSale = document.querySelectorAll('tbody tr')[posicion+1]
	//trSale.querySelector('td').className = 'alert-danger';
	//trSale.querySelectorAll('td')[entra+1].className = 'alert-warning';

	return posicion;
}

//identifica la vaiable que entra
function entraSimplex(z) {
	let posicion, mayor;
	
	for (let i = 0; i <= z.length; i++) {
		if (z[i] < 0) {
			if (i == 0) {
				mayor = z[0];
				posicion = 0;
			} else if (Math.abs(mayor) < Math.abs(z[i])) {
				posicion = i;
				mayor = z[i];
			}
		}
	}
	//document.getElementsByTagName('th')[posicion+1].className = 'alert-primary';
	return posicion;
}

// Metodo para agregar una restriccion al arreglo de restricciones
function agregarRestriccionSimplex(e) {
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
function estandarizarSimplex() {
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
			sbiSimplex.push('S'+(w+1));
		}
	}

	console.log(sbiSimplex)
	return modelo;
}

// Metodo para extraer los coeficientes de una expresion
function getCoeficientsSimplex(exp) {
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

// crea la tabla html con los valores de la matriz;
function crearTablaSimplex(tabla, iter) {
	let tablaHTML = document.getElementById('tbody');
	let filaHtml = '';
	
	tabla.forEach((fila, i) => {
		if (i == 0) {
			filaHtml = `<tr style="background-color: darkgrey; color: white;"><td>Z</td>`;
		} else {
			filaHtml = `<tr><td>${sbiSimplex[i-1]}</td>`
		}
		fila.forEach(coe => {
			filaHtml += '<td>' + coe + '</td>';
		});

		tablaHTML.innerHTML += filaHtml + '</tr>';
	});
}

function splitRestrictionSimplex(res) {
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

function calcularSimplex(tabla) {
	let objetivo = document.getElementById('obj-input').value
	
	
	modeloEstandardSimplex = estandarizarSimplex();

	/*let tablaInicial = [];

	let z = []; // contiene temporalmente la fila Z de la tabla incial

	getCoeficientsSimplex(modeloEstandardSimplex.objetivo).forEach(e => {
		z.push(e*(-1));
	});
	z.push(0)

	tablaInicial.push(z);

	modeloEstandardSimplex.restricciones.forEach((r, i) => {
		tablaInicial.push(getCoeficientsSimplex(r)); // coeficientes de las variales
		tablaInicial[i+1].push(parseFloat(r.split(' = ')[1])); // valor solucion
	});*/


	let tablaInicial = tabla;

	tablaInicial.forEach(fila => console.log(fila))
	// Crear cabecera de la tabla
	// con variables en funcion objetivo
	let variables = modeloEstandardSimplex.objetivo.match(/[a-zA-Z]\d{1,}/g);
	console.log(modeloEstandardSimplex)
	console.log(variables)

	let cabecera = document.getElementById('cabecera');
	cabecera.innerHTML = '<th>VB</th>';

	variables.forEach(x => {
		cabecera.innerHTML += '<th>' + x + '</th>';
	})

	cabecera.innerHTML += '<th>Sol</th>';

	if (metodoSimplex == 0) {
		simplex(tablaInicial)
	} else {
		alert('Este problema se resuelve por el metodo de la M o el de 2 Fases')
	}
}

function limpiar() {
	document.getElementById('obj-input').value = '';
	limpiarRestricciones();
	modeloEstandard = null;
}

function limpiarRestricciones() {
	document.getElementById('restriction-list').innerHTML = '';
	restricciones=[];
}