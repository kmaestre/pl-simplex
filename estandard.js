function estandarizar() {
	let restricciones = [
		'3X1+X2 = 3',
		'4X1+3X2 >= 6',
		'X1+2X2 <= 4'
	]; // Arreglo de restrcciones (cadenas)
	let c_restricciones = restricciones.length
	let v_artificiales = 0;
	let v_holgura = 0;	


	let modelo = {
		tipo: 'Min',
		objetivo: '4X1+X2',
		restricciones: [],
	};

	// calculo de catidades de cada tipo de variable
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

	// agregar varables exceso, holgur y artificiales a cada restriccion
	let c_art = 0;
	let c_hol = 0;

	restricciones.forEach((res) => {
		let estandard = res;
		
		for (let i = 1; i <= v_holgura; i++) {
			estandard = estandard.replace(' ', ('+0S'+ i + ' '));
		}

		for (let j = 1; j <= v_artificiales; j++) {
			estandard = estandard.replace(' ', ('+0R'+ j + ' '));
		}

		if (/\s=\s/g.test(estandard)) {
			estandard = estandard.replace('0R'+ (c_art+1), 'R'+ (c_art+1) );
			c_art += 1;
		}
		else if (/\s<=\s/g.test(estandard)) {
			estandard = estandard.replace('0S'+ (c_hol+1), 'S'+ (c_hol+1) );
			c_hol += 1;
		}
		if (/\s>=\s/g.test(estandard)) {
			estandard = estandard.replace('0R'+ (c_art+1), 'R'+ (c_art+1) );
			c_art += 1;
			estandard = estandard.replace('+0S'+ (c_hol+1), '-S'+ (c_hol+1) );
			c_hol += 1;
		}

		estandard = estandard.replace(/=|>=|<=/g, '=')

		modelo.restricciones.push(estandard);
	})

	console.log('restricciones:', c_restricciones),
	console.log('holgura:', v_holgura);
	console.log('articial:', v_artificiales);
	console.log('\n----- Modelo Estandard ------')
	console.log(modelo.tipo,'Z =', modelo.objetivo)
	console.log('\nSujeto a:')
	modelo.restricciones.forEach(r => console.log(r))
}

estandarizar();