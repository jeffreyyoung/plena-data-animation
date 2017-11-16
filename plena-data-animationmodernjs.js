var ANIMATION_DURATION = 3000;
var IMAGES = ["data_source_access.png", "data_source_adwords.png", "data_source_aws.png", "data_source_bing.png", "data_source_criteo.png", "data_source_entrata.png", "data_source_excel.png", "data_source_facebook.png", "data_source_firebird.png", "data_source_googleanalytics.png", "data_source_hadoop.png", "data_source_kenshoo.png", "data_source_mailchimp.png", "data_source_marin.png", "data_source_mongo.png", "data_source_moz.png", "data_source_mysql.png", "data_source_oracle.png", "data_source_postgres.png", "data_source_quickbooks.png", "data_source_salesforce.png", "data_source_sparksql.png", "data_source_stripe.png", "data_source_teradata.png", "data_source_trello.png", "data_source_twitter.png", "data_source_xero.png"]

function getRandomImageNotInUse(imgsInUse) {
	while (1) {
		var img = getRandomImageUri();
		if (!imgsInUse[img]) {
			return img;
		}
	}
}

function getRandomImageUri() {
	return '/images/'+IMAGES[getRandomNumber(0, IMAGES.length - 1)]
}

function calculateNextValue(initialValue, finalValue, percentProgress) {
	return initialValue + ((finalValue - initialValue) * percentProgress)
}

//passes the percent progress into the animateElement 
function animate(duration, animateElement) {
	var start = null;
	function step(timestamp) {
		if (!start) { start = timestamp; }
		var timeSinceAnimationStart = timestamp - start;
		var percentProgress = timeSinceAnimationStart / duration;
		
		animateElement(percentProgress);
		if (timeSinceAnimationStart < duration) {
			requestAnimationFrame(step);
		} else {
			animateElement(1);
		}
	}

	requestAnimationFrame(step);
}

function animateValue(from, to, duration, animateElement) {
	animate(duration, function(percentProgress) {
		var nextValue = calculateNextValue(from, to, percentProgress);
		animateElement(nextValue);
	})
}

function animateValues(froms, tos, duration, animateElement) {
	animate(duration, function(percentProgress) {
		var nextValues = froms.map((f, i) => calculateNextValue(f, tos[i], percentProgress));
		animateElement(nextValues);
	})
}



function getRandomNumber(min, max) {
	return Math.floor((Math.random() * (max - min)) + min);
}

function updateBarChart() {
	var bars = document.getElementsByClassName('bar-chart-bar');
	Array.from(bars).forEach(b => {
		var initialValue = parseInt(b.getAttribute('height'));
		var finalValue = getRandomNumber(2,9);
		animateValue(initialValue, finalValue, 500, function(nextValue) {
			b.setAttribute("height", nextValue);
		});
	})
}

function getPointsString(yValues) {
	var pointsString = '';
	yValues.forEach( (y, index) => {
		var x = index * 5 + 3;
		pointsString = pointsString + x +','+y+' '
	});
	return pointsString;
}

function updateLineChart() {
	var lines = document.getElementsByClassName('line-chart-line');

	Array.from(lines).forEach(line => {
		var points = line.getAttribute('points') || '';
		var coords = points //"3,10 6,12 9,4 12,2 "
			.trim() //"3,10 6,12 9,4 12,2"
			.split(' ') //["3,10", "6,12", "9,4", "12,2"]
			.map(coord => coord.split(',')) //[ ["3","10"] ...]
			.map(coord => coord.map(c => parseInt(c))) // [ "10", ...]
			
		var finalYValues = coords.map( (coord, i) => {
			if (i === 0 || i === coords.length - 1) { 
				return coord[1] 
			} else {
				return getRandomNumber(5, 10);
			}
		})
		var initialYValues = coords.map(cord => cord[1]);
		animateValues(initialYValues, finalYValues, 500, function(nextYValues) {
			line.setAttribute('points', getPointsString(nextYValues));
		})
	});
}

function updatePieChart() {
	var pies = document.querySelectorAll('.pie-chart .pie');
	Array.from(pies).forEach(p => {
		p.style['stroke-dasharray'] = getRandomNumber(8, 15) + ' 25';
	});
}

function animateCircle(circle, pathToFollow) {
	animateValue(0, pathToFollow.getTotalLength(), ANIMATION_DURATION - 600, (lengthOnCircle) => {
		var nextCoords = pathToFollow.getPointAtLength(lengthOnCircle);
		circle.setAttribute('cx', nextCoords.x);
		circle.setAttribute('cy', nextCoords.y);
	});
}

function animiateCircles() {
	var circles = document.querySelectorAll('.flying-circle');
	Array.from(circles).forEach(circle => {
		var pathId = circle.getAttribute('plena-data-animation-path-id');
		var pathToFollow = document.getElementById(pathId);
		setTimeout(animateCircle.bind(null, circle, pathToFollow), getRandomNumber(0,590)); //stagger circles
	});
}

function startImageRotation() {
	var images = Array.from(document.querySelectorAll('.data-source-image'));
	var imagesInUse = {};
	images.forEach(img => {
		imagesInUse[img.getAttribute('xlink:href')] = true;
	})
	var timeBetweenEachRotation = 1000;
	var imageIndex = 0;
	
	setInterval(() => {
		if (imageIndex > images.length - 1) {
			imageIndex = 0;
		}
		var image = images[imageIndex];
		var oldImage = image.getAttribute('xlink:href');
		var nextImage = getRandomImageNotInUse(imagesInUse);
		imagesInUse[oldImage] = false;
		imagesInUse[nextImage] = true;
		image.setAttribute('xlink:href', nextImage)
		imageIndex++;
	}, timeBetweenEachRotation);
}

$(document).ready(function(){
	function updateCharts() {
		updateBarChart();
		updateLineChart();
		updatePieChart();
	}
	
	$('.animation-logo').addClass('animation-logo-bounce');
	startImageRotation();
	animiateCircles();
	//trigger at end of animation
	setInterval(function() {
		updateCharts(); //update charts at end of each animation
		animiateCircles();
	}, ANIMATION_DURATION)
	
});