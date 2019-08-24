'use strict';

class Color {

    /**
     * Set red
     * @param val interger 0-255, if error 0
     */
    set r(val) {
        if(!Number.isInteger(val) || val < 0 || val > 255) {
            this._r = 0;
        }
        else {
            this._r = val;
        }
    }

    /**
     * Set green
     * @param val interger 0-255, if error 0
     */
    set g(val) {
        if(!Number.isInteger(val) || val < 0 || val > 255) {
            this._g = 0;
        }
        else {
            this._g = val;
        }
    }

    /**
     * Set blue
     * @param val interger 0-255, if error 0
     */
    set b(val) {
        if(!Number.isInteger(val) || val < 0 || val > 255) {
            this._b = 0;
        }
        else {
            this._b = val;
        }
    }

    /**
     * Set alpha
     * @param r float 0.0-1.0, if error 0
     */
    set a(val) {
        if(!Number.isFloat(val) || val < 0 || val > 1) {
            this._a = 0;
        }
        else {
            this._a = val;
        }
    }

    /**
     * Store Color with:
     * @param r interger 0-255, if error 0
     * @param g interger 0-255, if error 0
     * @param b interger 0-255, if error 0
     * @param a float 0.0-1.0, if error 0
     */
	constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    
    /**
     * Returns contrast ratio between relative luminances
     * @param y1 relative luminance
     * @param y2 relative luminance
     */
	static contrastRatio(y1, y2) {
		
		if(y1 > y2){
			return (y1 + 0.05) / (y2 + 0.05);
		}
		else{
			return (y2 + 0.05) / (y1 + 0.05)
		}
		
	}
    
    /**
     * Returns relative luminances or 0 if error
     * @param color Color object
     */
	static relativeLuminance(color) {

        if(color.constructor.name !== Color.name) {
            return 0;
        }
		
		const r = color._r/255;
		const g = color._g/255;
		const b = color._b/255;
		
		const rr = r > .03928 ? Math.pow((r + .055) / 1.055, 2.4) : r / 12.92;
		const gg = g > .03928 ? Math.pow((g + .055) / 1.055, 2.4) : g / 12.92;
		const bb = b > .03928 ? Math.pow((b + .055) / 1.055, 2.4) : b / 12.92;
		
		return 0.2126*rr + 0.7152*gg + 0.0722*bb;
		
	}
	
	toString() {
		if(this.a > 0){
			return 'rgba('+this._r+','+this._g+','+this._b+','+this._a+')';
		}
		return 'rgb('+this._r+','+this._g+','+this._b+')';
	}
	
}