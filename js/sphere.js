$(function() {

	// Scene size
	var width = window.innerWidth,
		height = window.innerHeight;

	// Camera position
	var angle  = 45,
		aspect = width / height,
		near   = 1,
		far    = 1000,
		zoom   = 500;

	var camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
	camera.position.z = zoom;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);

	var scene = new THREE.Scene();

	/*
	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(5,3,5);
	scene.add(light);
	*/


    // the first argument of THREE.SphereGeometry is the radius, the second argument is
    // the segmentsWidth, and the third argument is the segmentsHeight.  Increasing the 
    // segmentsWidth and segmentsHeight will yield a more perfect circle, but will degrade
    // rendering performance
    // http://www.html5canvastutorials.com/three/html5-canvas-webgl-sphere-with-three-js/

	var geometry = new THREE.SphereGeometry(150, 32, 32),
		material = new THREE.MeshNormalMaterial(),
		sphere   = new THREE.Mesh(geometry, material);

	scene.add(sphere)

	renderer.render(scene, camera);

	$("#slider").slider({
		orientation: "vertical",
		max: 256,
		value: 32,
		slide: function( event, ui ) {
			console.log(ui.value);
			//$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
		}		
	});

});

