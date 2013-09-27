$(function() {

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

    var sphere = createSphere(radius, segments, segments);
	sphere.rotation.y = 3;
	scene.add(sphere)

    var clouds = createClouds(radius, segments, segments);
	clouds.rotation.y = 3;
	scene.add(clouds)

	var stars = createStars();
	scene.add(stars);

	var controls = new THREE.TrackballControls( camera );

    var step = 3;

	render();

	function render() {
		controls.update();
		sphere.rotation.y += 0.0005;
		clouds.rotation.y += 0.0005;		
		requestAnimationFrame(render);
		renderer.render(scene, camera);
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

