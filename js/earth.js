// Created by Bjorn Sandvik - thematicmapping.org
(function () {

	var webglEl = document.getElementById('webgl');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	var width  = window.innerWidth,
		height = window.innerHeight;



	//CONTROLS
	var controls = new function(){
			this.lat = 0;
			this.lon = 0;
		};
	
	var gui = new dat.GUI();
	gui.add( controls, 'lat', -90, 90);
	gui.add( controls, 'lon', -180, 180);


	// Earth params
	var radius   = 0.5,
		segments = 32,
		rotation = 6;  

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.z = 1.5;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	scene.add(new THREE.AmbientLight(0x333333));

	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(5,3,5);
	//scene.add(light);

    var sphere = createSphere(radius, segments);
	sphere.rotation.y = rotation; 
	scene.add(sphere)


	var stars = createStars(90, 64);
	scene.add(stars);


	var lineGeom = new THREE.Geometry();
	lineGeom.vertices.push(
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 0, 0, 30 )	
	);

	var line = new THREE.Line( lineGeom, new THREE.LineBasicMaterial({color: 0xffffff}) );
	
	scene.add( line );
	


	var cameraControls = new THREE.TrackballControls(camera);

	webglEl.appendChild(renderer.domElement);

	render();

	function render() {
		cameraControls.update();
		
		
		//update line
		var r = 1.1*radius;
		line.geometry.vertices[1].x  = r * Math.cos(controls.lat*Math.PI/180.0)*Math.cos(-controls.lon*Math.PI/180.0);
		line.geometry.vertices[1].y  = r * Math.sin(controls.lat*Math.PI/180.0);
		line.geometry.vertices[1].z  = r * Math.cos(controls.lat*Math.PI/180.0)*Math.sin(-controls.lon*Math.PI/180.0);
		line.geometry.verticesNeedUpdate = true;
		
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	function createSphere(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshBasicMaterial({
				map:         THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg')
			})
		);
	}

	function createStars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments), 
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'), 
				side: THREE.BackSide
			})
		);
	}

}());