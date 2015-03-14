/* C'est quoi le code */
/* Derived from the excellent CODEBOOK from Daniel Chooper : http://danielchasehooper.com/CodeBook/ */

var CODEBOOK, draw, Keys, ctx, sketchpad;

/* 
 * Javascript additions
 */

if (!console) {
	var console = {log: function(string){"use strict";}};
}

if (typeof Object.create !== 'function') {
	"use strict";
	Object.create = function (o) {
		function F(){}
		F.prototype = o;
		return new F();
	};
}

/* 
 * API Functions 
 * These are availible to the code being run
 * 
 */

// draw = function(c){};

Keys = {left:false,down:false,right:false,up:false};

function circle(x,y,r){
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
}

function framerate(fps){"use strict";
	return CODEBOOK.framerate(fps);
}

function color(r,g,b,a) {"use strict";
	return "rgba("+r+","+g+","+b+","+(a || 1)+")";
}

function exists(value) {"use strict";
	return (typeof value !== "undefined" && value !== null);
}


/* 
 * Starfield Functions 
 * These are availible to the code being run
 * 
 */

// var nombreEtoiles = 50;
var etoiles = [];
var taille = 0;
var trimDessin = document.createElement('canvas');
var currTaille = 0;

ajouteEtoile = function() {
	etoiles.push({
		x : Math.random() * 500,
		y : Math.random() * 500,
		z : 0.2 + Math.random()*0.8,
		r : 0
	});
};

draw = function(ctx) {
	framerate(60);
	ctx.fillStyle = color(0, 0, 0);
	ctx.fillRect(0, 0, 500, 500);
	update();
	animation(etoiles);
};

update = function() {
	nombre = Math.min(Math.max(0, nombre), 5000);
	if(nombre < etoiles.length) {
		etoiles.splice(nombre, etoiles.length - nombre);
	} else while(nombre > etoiles.length) {
		ajouteEtoile();
	}
};

cropImageFromCanvas = function(src, dst) {

	var srcCtx = src.getContext('2d');
	var dstCtx = dst.getContext('2d');

	var w = src.width,
		h = src.height,
		pix = {x:[], y:[]},
		imageData = srcCtx.getImageData(0,0,src.width,src.height),
		x, y, index;

	for (y = 0; y < h; y++) {
			for (x = 0; x < w; x++) {
					index = (y * w + x) * 4;
					if (imageData.data[index+3] > 0) {
							pix.x.push(x);
							pix.y.push(y);
					}
			}
	}
	pix.x.sort(function(a,b){return a-b;});
	pix.y.sort(function(a,b){return a-b;});
	var n = pix.x.length-1;

	w = pix.x[n] - pix.x[0];
	h = pix.y[n] - pix.y[0];
	if (w > 1 && h > 1) {
		var cut = srcCtx.getImageData(pix.x[0], pix.y[0], w, h);
		dst.width = w;
		dst.height = h;
		dstCtx.putImageData(cut, 0, 0);
	}
};

function animation(etoiles) {}

function avance_de(vitesse) {
	for(var i=0; i<etoiles.length; i++){
		e = etoiles[i];
		e.x += vitesse * e.z;
		if(e.x > 500 + currTaille) {
			e.x = -currTaille - 20;
		} else if (e.x < -currTaille - 20) {
			e.x = 500 + currTaille;
		}
	}
}

function dessine_forme(nombre, taille, type) {
	if(taille < 0) taille = 0;
	var i;
	if (type == 'rond') {
		currTaille = taille;
		for(i=0; i<etoiles.length; i++){
			e = etoiles[i];
			// circle();
			ctx.beginPath();
			ctx.arc(e.x-taille*0.5, e.y-taille*0.5, e.z * taille, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();
		}
	} else if (type == 'carré' || type == 'carre') {
		currTaille = taille;
		ctx.beginPath();
		for(i=0; i<etoiles.length; i++){
			e = etoiles[i];
			ctx.rect(e.x, e.y, taille, taille);
			// circle(e.x-taille*0.5, e.y-taille*0.5, e.z * taille);
		}
		ctx.closePath();
		ctx.fill();
	} else if (type == 'dessin') {
		max = Math.max(trimDessin.width, trimDessin.height);
		scale =  taille * 10 / max;
		scale = Math.min(2, scale);
		currTaille = scale * trimDessin.width;

		ctx.save();
		ctx.scale(scale, scale);
		for(i=0; i<etoiles.length; i++){
			e = etoiles[i];
			ctx.save();
			ctx.translate(e.x / scale + taille * 0.5, e.y / scale -trimDessin.height*0.5 + taille * 0.5);
			ctx.rotate(e.r);
			ctx.translate(-taille*0.5, -taille*0.5);
			ctx.drawImage(trimDessin, 0, 0, taille, taille);
			// ctx.translate(e.x / scale, e.y / scale -trimDessin.height*0.5);
			// ctx.drawImage(trimDessin, e.x / scale, e.y / scale -trimDessin.height*0.5, taille, taille);
			ctx.restore();
		}
		ctx.restore();
	}
}

function tourne_de(rotation) {
	for(i=0; i<etoiles.length; i++){
		e = etoiles[i];
		e.r += rotation * e.z * 0.01;
	}
}

function chaque(arr, func) {
	for(var i=0; i<arr.length; i++){
		e = arr[i];
		func(e);
	}
}

function prend_feuille(r,g,b){
	ctx.save();
	prend_crayon(r,g,b);
	ctx.fillRect(0, 0, 500, 500);
	ctx.restore();
}

function prend_crayon(r, g, b) {
	if(typeof r == "string") {
		if(r=='blanc' || r=='blanche')r='white';
		if(r=='noir' || r=='noire')r='black';
		if(r=='rouge')r='red';
		if(r=='vert' || r=='verte')r='green';
		if(r=='bleu' || r=='bleue')r='blue';
		if(r=='jaune')r='yellow';
		if(r=='rose')r='magenta';
		if(r=='violet' || r=='violette') r='purple';
		if(r=='marron') r=color(100,50,0);
		ctx.fillStyle = r;
	} else {
		ctx.fillStyle = color(r*255,g*255,b*255);
	}
}


/* 
 * Codebook Core 
 * The interesting stuff
 * 
 */

CODEBOOK = (function(){
	"use strict";
	var editor;
	var jslintWorker;
	var errors = [];
	
	var errorLineNumber = -1;
	var errorText = "";
	var isSlidingNumber = false;
	var lastMousePosition = false;
	var lastCursorLine;
	var controlPressed;
	
	// from touch view
	var canvas, context;
	
	var scriptNode;
	var timeout;
	var initialValues = {};
	var framerateInterval = 17;
	
	var editorHasFocus = false;
	
	var canvasHightlightColor = "#e33";

	var hightlightLine, getHighlightLine;
	(function () {
		var line = -1;
		
		hightlightLine = function(newLineNumber) {
			editor.setLineClass(line-1, undefined);
			
			line = newLineNumber;
			
			if (line !== -1) {
				editor.setLineClass(line-1, "highlightLine");
			}
			
			if (!timeout) {
				render(true, false);
			}
		};
		
		getHighlightLine = function() {
			return line;
		};
	}());
	

	var typesToPersistState = {
		number:true,
		boolean:true,
		string:true
	};
/* typesToPersistState["function"] = true; */
	
	/* Event Handlers */
	
	function keyDownHandler(e){

		if (!editorHasFocus) {
			switch(e.keyCode) {
				case 37:
					Keys.left = true;
					break;
				case 38:
					Keys.up = true;
					break;
				case 39:
					Keys.right = true;
					break;
				case 40:
					Keys.down = true;
					break;
			}
		}
		
		if (e.keyCode === 91 || e.keyCode === 18) {
			controlPressed = true;
		}
	}
	
	function keyUpHandler(e){
		switch(e.keyCode) {
			case 37:
				Keys.left = false;
				break;
			case 38:
				Keys.up = false;
				break;
			case 39:
				Keys.right = false;
				break;
			case 40:
				Keys.down = false;
				break;
		}
		
		if (e.keyCode === 91 || e.keyCode === 18) {
			controlPressed = false;
		}
	}
	
	function hideErrorPopover(){
		document.getElementById("errorReport").className  = "hideReport";
	}
	
	function lintParsingComplete(e){
		errors = e.data.errors;
		
		// check for errors
		if (!e.data.passed) {
			var i;
			console.log("setting JSLint line markers");
			for (i = 0; i < errors.length; i+=1) {
				if (errors[i]) {
					editor.setLineClass(errors[i].line,"errorLine");
					editor.setMarker(errors[i].line," ","errorMarker");
				}
			}
		}
		
		if (errorLineNumber >= 0) {
			editor.setLineClass(errorLineNumber,"errorLine");
			editor.setMarker(errorLineNumber," ","errorMarker");
		}
		
		// navigate to first error?
	}
	
	function textChangeHandler(editorArg, info) {
		var i, editorString;
				
		if (jslintWorker) {
			jslintWorker.postMessage({cmd:"STOP"});
			jslintWorker = undefined;
		}
		
		editorString = editor.getValue();
		window.localStorage.code = editorString;

		if (!isSlidingNumber){
			errorLineNumber = -1;
			hideErrorPopover();
			errors = [];
		
		
			// This takes a really long time to do, should look for another way.
			for (i = 0; i < editor.lineCount(); i++) {
				editor.setLineClass(i,undefined);
				editor.clearMarker(i);
			}
		
			// console.log("Messaging worker");
			// jslintWorker = new Worker('scripts/jsLintWorker.js');
			// jslintWorker.addEventListener("message",lintParsingComplete,false);
			// jslintWorker.postMessage({cmd:"lint",code:editorString});
		}
		
		// TODO: should liveview only be updated if code is valid? 
		updateCode(editorString);
	}
	
	function showErrorForLine(line) {
		var errorString = "";
		var i;
		for (i =0; i < errors.length; i++) {
			if (exists(errors[i]) && errors[i].line === line) {
				errorString += errors[i].reason+"\n";
				break;
			}
		}

		if(errorLineNumber === line) {
			errorString = errorText;
		}

		if (errorString.length > 1){
			var el = document.getElementById("errorReport");
			el.innerHTML = errorString;
			el.style.top = editor.charCoords({line:line+1,ch:0}).y +2+ "px";
			el.className = "";
			el.addEventListener('mouseout',function(){
				hideErrorPopover();
			},true);
		}
	}



	/* Events */
	
	function mouseoutHandler(e) {
		hightlightLine(-1);
	}

	function mouseDown(event){
		if (controlPressed) {
			event.preventDefault();
			lastMousePosition = {x:event.pageX,y:event.pageY};
			var position = editor.coordsChar(lastMousePosition);
			var content = editor.getTokenAt(position);
			
			if (!isNaN(content.string) && content.className==="number" && !editor.somethingSelected()) {
				isSlidingNumber = content;
				isSlidingNumber.lineNumber = position.line;
				
				// include negative numbers
				var prefix = editor.getTokenAt({line:position.line, ch: content.start});
				if (prefix.string === '-') {
					isSlidingNumber.start-=1;
					isSlidingNumber.string = '-'+isSlidingNumber.string;
				}
				
				event.stopPropagation();
			} else {
				isSlidingNumber = false;
			}
		}
	}

	function mouseMoved(e){
		if (isSlidingNumber) {
			isSlidingNumber.dragged = true;
			
			var newString = String(parseFloat(isSlidingNumber.string)+(e.pageX - lastMousePosition.x));
			
			editor.replaceRange(newString,
			{line:isSlidingNumber.lineNumber,
				ch:isSlidingNumber.start},
				{line:isSlidingNumber.lineNumber,
					ch:isSlidingNumber.end});

			isSlidingNumber.string = newString;
			isSlidingNumber.end = isSlidingNumber.start+isSlidingNumber.string.length;
			
			editor.setSelection({
				line:isSlidingNumber.lineNumber,
				ch:isSlidingNumber.start
			}, {
				line:isSlidingNumber.lineNumber,
				ch:isSlidingNumber.end
			});
			e.stopPropagation();
		}

		lastMousePosition = {x:e.pageX,y:e.pageY};
		
	}

	function mouseUp(event) {
		if (isSlidingNumber) {
			var temp = isSlidingNumber;

			// move cursor to another line to let layout engine do its job
			if (isSlidingNumber.dragged) {
				setTimeout(function (){
						editor.setCursor({line:temp.lineNumber+1,ch:1});
						editor.setCursor({line:temp.lineNumber,ch:temp.end});

						
				},1);
			}
		}
		isSlidingNumber = false;
	}

	/* text events */

	function cursorActivity() {
		if (isSlidingNumber) {
		//	editor.setCursor({line:isSlidingNumber.lineNumber,ch:isSlidingNumber.end});

			editor.setSelection({line:isSlidingNumber.lineNumber,
				ch:isSlidingNumber.start},
				{line:isSlidingNumber.lineNumber,
					ch:isSlidingNumber.end});
		} else {
			
			var currentCursorLine = editor.getCursor().line;
			if(lastCursorLine !== currentCursorLine) {
				showErrorForLine(currentCursorLine);
			}
			lastCursorLine = currentCursorLine;
		}
	}

	function gutterClicked(editInstance, line, event) {
		showErrorForLine(line);
	}

	function updateCode(string) {
		stop();
	

		// keep track of new variables by learning old variables
		var firstLevel =  {};
		var propertyName;
		for (propertyName in window) {
			if (window.hasOwnProperty(propertyName) && typesToPersistState[typeof window[propertyName]]) {
				firstLevel[propertyName] = window[propertyName];
			}
		}

		string = CoffeeScript.compile(string, { bare: true });

		// create node
		var sourceHolderEl = document.getElementById("sourceHolder");
		var newScript = document.createElement('script');
		newScript.type = 'text/javascript';

		var sourceTextNode = document.createTextNode(string);
		newScript.appendChild(sourceTextNode);

		if (sourceHolderEl.hasChildNodes()){
			while ( sourceHolderEl.childNodes.length >= 1 ) {
				sourceHolderEl.removeChild( sourceHolderEl.firstChild );
			}
		}
		
		try {
			sourceHolderEl.appendChild(newScript);
		} catch(e) {
			console.log("compile Error: "+e);
		}

		for (propertyName in window) {
			if (typesToPersistState[(typeof window[propertyName])+""]) {

				if (!firstLevel[propertyName]) { // this variable did not exist before
					initialValues[propertyName] = window[propertyName];
				} else {
					if (window[propertyName] !== firstLevel[propertyName]) { // variable changed after compilation
						if (window[propertyName] === initialValues[propertyName]) {
							// if variable was set to initial value, reset to last known value
							window[propertyName] = firstLevel[propertyName];
						} else {
							// variable was set to something new, update initial value
							initialValues[propertyName] = window[propertyName];
						}
					}
				}
			}
		}
		
		// TODO: delete unused variables/functions
		// find variables in the old version that were not (re)added to the new version
		// delete them

		render();
		start();

		$('span.cm-variable').each(function(key, val){
			var v = $(this).html();
			if(v.indexOf('_') != -1) {
				$(this).addClass('action');
			} else if(v == 'animation'){
				$(this).addClass('loop');
			}
		});
		$('span.cm-operator').each(function(key, val){
			$(this).addClass('arrow');
		});
	}
	
	function render(preventVariableUpdate) {
		var firstLevel =  {}, propertyName;
		
		if (preventVariableUpdate) {
			for (propertyName in window) {
				if (window.hasOwnProperty(propertyName) && typesToPersistState[typeof window[propertyName]]) {
					firstLevel[propertyName] = window[propertyName];
				}
			}
		}
		
		draw(context);

		if (preventVariableUpdate) {
			for (propertyName in firstLevel) {
				window[propertyName] = firstLevel[propertyName];
			}
		}
	}
	
	function start() {
		if (!timeout && framerateInterval > 0) {
			timeout = window.setInterval(render,framerateInterval);
		}
	}
	
	function stop() {
		if (timeout) {
			window.clearInterval(timeout);
		}
		timeout = undefined;
	}
	
	function displayFrameErrored (msg, linenumber) {
		console.log("user script error: "+msg);
		if (errorLineNumber >= 0) {
			editor.setLineClass(errorLineNumber,null);
			editor.clearMarker(errorLineNumber);
		}
		errorLineNumber = linenumber-1;
		editor.setLineClass(errorLineNumber,"errorLine");
		editor.setMarker(errorLineNumber," ","errorMarker");
		errorText = msg;
	}
	
	function scrollToLine(line) {
		var ycoord = editor.charCoords({line:line,ch:0}).y;
		
		// This does not work. I have no idea why not.
		/* editor.scrollTo(0, ycoord); */
	}
	
	window.onload = function() {

		sketchpad = $('#Sketchpad').sketchpad({
			aspectRatio: 1,
			canvasColor: 'linear-gradient(to right, rgba(69,70,64,1) 0%, rgba(59,60,54,1) 25%, rgba(39,40,36,1) 85%, rgba(18,18,16,1) 100%)',
			strokes: 'JSON',
		});
		sketchpad.setLineSize(3);
		sketchpad.setLineColor('white');
		$('#clear').click(function(){
			sketchpad.clear();
			trimDessin.getContext('2d').clearRect(0,0,trimDessin.width, trimDessin.height);
		});


		var colorPickerOpened = false;
		var $colorPicker = $('#color').wheelColorPicker({
			format : 'css'
		});
		$colorPicker.on('slidermove', function() {
			sketchpad.setLineColor( $(this).val() );
		});
		// $colorPicker.on('click', function() {
		// 	$colorPicker.wheelColorPicker('show');
		// });

		var sketchpadDraw = function() {
			cropImageFromCanvas(sketchpad[0], trimDessin);
		};
		sketchpad.mousedown(function(){
			sketchpad.on('mousemove', sketchpadDraw);
			$colorPicker.blur();
			var colorPickerHidden = $colorPicker.wheelColorPicker('isHidden');
			if(!colorPickerHidden) {
				$colorPicker.wheelColorPicker('hide');
			}
		});
		sketchpad.mouseup(function(){
			sketchpad.off('mousemove', sketchpadDraw);
		});
		
		

		$('#tabs button').click(function() {
			var el = $(this);
			if (el.hasClass('active')) return;
			$('#tabs button').removeClass('active');
			el.addClass('active');

			var $pad = $('#SketchpadContainer').hide();
			var $code = $('.CodeMirror').hide();
			var $help = $('#help').hide();
			switch(el.attr('id')) {
				case 'b_code': $code.show(); break;
				case 'b_drawing': $pad.show(); break;
				case 'b_help': $help.show(); break;
			}

			// if (el.attr('id') == 'b_code') {

			// } else if (el.attr('id' == 'b_drawing')) {

			// }
		});

		editor = CodeMirror.fromTextArea(document.getElementById("code"), {
			lineNumbers: false,
			gutter: false,
			matchBrackets: true,
			onChange:textChangeHandler,
			theme:"monokai",
			onGutterClick:gutterClicked,
			onCursorActivity:cursorActivity,
			indentWithTabs:true,
			indentUnit:3,
			tabSize:3,
			fixedGutter:true,
			onFocus: function () {editorHasFocus = true; Keys={};},
			onBlur:function(){ editorHasFocus = false; }
		});

		// view functionality
		canvas = document.getElementById("TouchCodeMainCanvas");
		ctx = context = canvas.getContext('2d');
		
		//set up normal context object
		
		context.secretFillRect = context.fillRect;
		context.fillRect = function(x,y,w,h) {
			if (CODEBOOK.currentOperatingLineNumber === getHighlightLine()) {
				context.fillStyle = canvasHightlightColor;
			}
			context.secretFillRect(x,y,w,h);
		};
		
		context.secretfill = context.fill;
		context.fill = function() {
			if (CODEBOOK.currentOperatingLineNumber === getHighlightLine()) {
				context.fillStyle = canvasHightlightColor;
			}
			context.secretfill();
		};
		
		context.secretdrawImage = context.drawImage;

		context.drawImage = function(img,x,y) {
			if (CODEBOOK.currentOperatingLineNumber === getHighlightLine()) {
			} else {
				context.secretdrawImage(img,x,y);
			}
		};
		
		document.addEventListener('mousedown',mouseDown, true);
		document.addEventListener('mousemove',mouseMoved, true);
		document.addEventListener('mouseup',mouseUp, false);
		document.addEventListener('mouseout',mouseoutHandler, false);
		document.addEventListener("keydown",keyDownHandler,true);
		document.addEventListener("keyup",keyUpHandler,true);
		
		
		if (window.localStorage.code) {
			editor.setValue(window.localStorage.code);
		} else {
			textChangeHandler();
		}
		
		hightlightLine(0);

		

	};
	
	window.onerror = function(msg, url, linenumber){
		if (url.indexOf("index.html") !== -1) {
			stop();
			displayFrameErrored(msg, linenumber);
			return true; // prevent error from showing up later
		}
	};
	
	return {
		framerate: function(fps){
			if (!isNaN(fps)) {
				var newValue = (fps > 0 ? 1000/fps : 0);
				if (newValue != framerateInterval) {
					stop();
					framerateInterval = newValue;
					start();
				}
			}
			return framerateInterval;
		},
		currentOperatingLineNumber:0
	};
}());




