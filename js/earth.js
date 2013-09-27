$(function() {

    //var stats = initStats();

	// Scene size
	var width  = window.innerWidth,
		height = window.innerHeight;

	// Sphere
	var radius    = 0.5,
		segments  = 32;

	// Camera position
	var angle  = 45,
		aspect = width / height,
		near   = 0.01,
		far    = 1000,
		zoom   = 1.5;

	var camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
	camera.position.z = zoom;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	$("#webgl").append(renderer.domElement);

	var scene = new THREE.Scene();

	var light = new THREE.AmbientLight(0x333333)
	scene.add(light)

	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(5,3,5);
	scene.add(light);

    // the first argument of THREE.SphereGeometry is the radius, the second argument is
    // the segmentsWidth, and the third argument is the segmentsHeight.  Increasing the 
    // segmentsWidth and segmentsHeight will yield a more perfect circle, but will degrade
    // rendering performance
    // http://www.html5canvastutorials.com/three/html5-canvas-webgl-sphere-with-three-js/

    var sphere = createSphere(radius, segments, segments);
	scene.add(sphere)

    var clouds = createClouds(radius, segments, segments);
	scene.add(clouds)

	var stars = createStars();
	scene.add(stars);


    var step = 0;

	// Setup Control GUI
	var controls = new function () {
		this.radius = radius;
        this.segments = segments;

		this.redraw = function () {
			scene.remove(sphere);
			sphere = createSphere(controls.radius, controls.segments, controls.segments);
			scene.add(sphere);
        };
    }

    /*
	var gui = new dat.GUI();
	gui.add(controls, 'radius', 1, 400).onChange(controls.redraw);
	gui.add(controls, 'segments', 1, 100).onChange(controls.redraw);
	*/

	render();

	function render() {
		//stats.update();
		sphere.rotation.y = step += 0.001;
		clouds.rotation.y = step += 0.001;		
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	function initStats() {
		var stats = new Stats();
		stats.setMode(0); // 0: fps, 1: ms
		$("#stats").append(stats.domElement);
		return stats;
	}

	function createSphere(radius, widthSegments, heightSegments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, widthSegments, heightSegments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
				bumpScale:   0.002,
				specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
				specular:    new THREE.Color('grey')								
			})
		);
	}

	function createClouds(radius, widthSegments, heightSegments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius + 0.003, widthSegments, heightSegments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/fair_clouds_4k.neuquant.png'),
				transparent: true
			})
		);		
	}

	function createStars() {
		return new THREE.Mesh(
			new THREE.SphereGeometry(90, 32, 32), 
			new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'),
				side: THREE.BackSide
			})
		);
	}


});

