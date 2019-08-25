'use strict';

 /**
 * Returns a number with a specified quantity of digits after the decimal point
 * If e+ or e- after eval then Mart.round(this)
 * @param precision Integer of significant digits after the decimal point
 */
Number.prototype.round = function(precision){
	
	if(!Number.isInteger(precision) || !Number.isFloat(this)){
		return this;
	}
	
	if((this+'').includes('e')) {
		return Math.round(this);
	}

	// Example
	// this = 1234.56789
	// precision = 3
	// [this]e+[precision] => 1234567.89
	// Math.round(1234567.89) => 1234568
	// 1234568e-[precision] => 1234.568

	return +(Math.round(+(+this+'e+'+precision))+'e-'+precision);
	
}

 /**
 * Returns a mapped number from a-b range to x-y range
 * @param in_min float
 * @param in_max float
 * @param out_min float
 * @param out_max float
 */
Number.prototype.map = function(in_min, in_max, out_min, out_max){
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

Number.isInteger = Number.isInteger || function(a) {
    return !((a ^ 0) !== a || a === null);
}

Number.isFloat = function(a) {
    return !(Number.isNaN(a) || a === null);
}