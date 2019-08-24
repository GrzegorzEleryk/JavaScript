'use strict';

class Animation {

	constructor(from, to, duration, animationPath, targets, callback){

		this.from = from;
		this.to = to;
		this.duration = duration;
		this.animationPath = animationPath;
		this.callback = callback;
		this.targets = targets;
		this.interrupt = false;

		this.targets.forEach(target => {
			target.addEventListener('click', () => this.interrupt)
		});

		this.startTime = Date.now();
        Animation.frame.request(this.step.bind(this));
        
	}

	removeInterrupters(){
		this.targets.forEach(target => {
			target.removeEventListener('click', () => this.interrupt)
		});
	}

	interrupt(){
		this.interrupt = true;
	}

	step(){

		if(this.interrupt){
			this.removeInterrupters();
			return;
		}

		const progress = ((Date.now()-this.startTime)/this.duration).round(3);

		if(progress >= 1){
			this.callback(this.to);
			this.removeInterrupters();
		}
		else{
			const mapped = this.animationPath[progress].map(0, 1, this.from, this.to);
			this.callback(mapped);
			Animation.frame.request(this.step.bind(this), null, false);
		}

	}

	static getPath(b){
	
		let path = {};
		let x_curr, y_curr, minx, miny, maxx, maxy;
		let lineX = 0;
		let x_prev = 0, y_prev = 0;
		
		minx = miny = Number.POSITIVE_INFINITY;
		maxx = maxy = Number.NEGATIVE_INFINITY;
		
		for(let t = 0; t <= 1; t = (t+0.0001).round(4)){
			
			x_curr = Math.pow(1-t,3)*b[0] + 3*Math.pow(1-t,2)*t*b[2] + 3*Math.pow(1-t,1)*Math.pow(t,2)*b[4] + Math.pow(t,3)*b[6];
			y_curr = Math.pow(1-t,3)*b[1] + 3*Math.pow(1-t,2)*t*b[3] + 3*Math.pow(1-t,1)*Math.pow(t,2)*b[5] + Math.pow(t,3)*b[7];
			
			minx = minx < x_curr ? minx : x_curr;
			miny = miny < y_curr ? miny : y_curr;
			
			maxx = maxx < x_curr ? x_curr : maxx;
			maxy = maxy < y_curr ? y_curr : maxy;
			
			let bounds = [minx, miny, maxx-minx, maxy-miny];
			let x = lineX;
			let bezierPartLine = [x_prev, y_prev, x_curr, y_curr];
			
			for(x; x <= 1; x = (x+0.0001).round(4)){
				let intersection = Animation.findIntersection(bezierPartLine, [x, bounds[1], x, bounds[3]], false);
				if(!intersection){
					break;
				}
				path[intersection[0].round(4)] = intersection[1].round(4);
			}
			
			lineX = x;
			x_prev = x_curr;
			y_prev = y_curr;
		}
		
		return path;
	
	}
	
	static findIntersection(a, b, a_inf) {

		let a_px = a[0];
		let a_py = a[1];
		let a_dx = a[2] - a[0];
		let a_dy = a[3] - a[1];
		
		let b_px = b[0];
		let b_py = b[1];
		let b_dx = b[2] - b[0];
		let b_dy = b[3] - b[1];
		
		let p = b_dx*a_dy - b_dy*a_dx;
		
		if( p == 0 || a_dx == 0 ){
			return null;
		}
		
		let T2 = (a_dx*(b_py-a_py)+a_dy*(a_px-b_px))/p;
		let T1 = (b_px+b_dx*T2-a_px)/a_dx;
		
		// Must be within parametic whatevers for RAY/SEGMENT
		if( a_inf == 1 ){
			if( T1<0 || T2<0 || T2>1 ) return null;
		}
		else if( a_inf == 0 ){
			if( T1<0 || T2<0 || T1>1 || T2>1 ) return null;
		}
		
		// Return the POINT OF INTERSECTION
		// x, y, param
		return [
			a_px+a_dx*T1,
			a_py+a_dy*T1,
			T1
		];
		
	}
    
    static frame = (function() {
	
        var lastTime = 0;
        var fpsMax = 60;
        var canvasCount = 1;
        var fps = fpsMax;
        var minimumDelay = 0
        applyMinimunDelay();
    
        function applyMinimunDelay(){
            minimumDelay = (1000/fps) / canvasCount;
        }
    
        return {
    
            addCanvas: function(){
                ++canvasCount;
                applyMinimunDelay();
            },
    
            removeCanvas: function(){
                if(canvasCount-- != 0){
                    --canvasCount;
                    applyMinimunDelay();
                }
                else{
                    console.error('window.AnimationFrame.removeCanvas function:\nminimum canvasCount equals one(1)');
                    return;
                }
            },
    
            request: function(callback, args, cutOut){
    
                var currentTime = Date.now();
                var timeToCall = Math.max(0, minimumDelay - (currentTime - lastTime));
                lastTime = currentTime;
    
                if(!cutOut){
                    lastTime -= timeToCall;
                }
    
                window.setTimeout(function() {
                    callback(args);
                }, timeToCall);
            
            },
    
            setFps: function(newFps){
            
                if(typeof newFps !== 'number' || arguments.length != 1){
                    console.error('window.AnimationFrame.setFps function:\ncan apply ony number argument');
                    return;
                }
    
                if(newFps <= 0){
                    console.error('window.AnimationFrame.setFps function:\nnewFps must be greater than zero(0)');
                    return;
                }
    
                if(newFps > fpsMax){
                    console.warn('window.AnimationFrame.setFps function:\nfps is greaten then fpsMax('+fpsMax+')\nfps = fpsMax');
                    newFps = fpsMax;
                }
    
                if(newFps == fps){
                    console.warn('window.AnimationFrame.setFps function:\nnewFps equals current fps');
                }
    
                fps = newFps;		
                applyMinimunDelay();
            
            }
    
        };
    
    })();

};
