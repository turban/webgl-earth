	var renderer	= new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	var onRenderFcts= [];
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000 );
	camera.position.z = 1.5;

	/*
	var light = new THREE.AmbientLight(0x888888);
	scene.add(light);
	*/

	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(5,3,5);
	scene.add(light);

	//////////////////////////////////////////////////////////////////////////////////
	//		add an object and make it move					//
	//////////////////////////////////////////////////////////////////////////////////	

	var geometry	= new THREE.SphereGeometry(0.5, 32, 32);

	var material	= new THREE.MeshPhongMaterial({
		map			: THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
		bumpMap		: THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
		bumpScale	: 0.05,
		specularMap	: THREE.ImageUtils.loadTexture('images/water_4k.png'),
		specular	: new THREE.Color('grey')
	});

	var earthMesh	= new THREE.Mesh(geometry, material);

	scene.add(earthMesh)
	onRenderFcts.push(function(delta, now){
		earthMesh.rotateY( 1/32 * delta )
	})





	// CLOUDS

	var canvasResult	= document.createElement('canvas');
	canvasResult.width	= 4096;
	canvasResult.height	= 2048;
	var contextResult	= canvasResult.getContext('2d')		

	// load earthcloudmap
	var imageMap	= new Image();

	imageMap.addEventListener("load", function() {
		
		// create dataMap ImageData for earthcloudmap
		var canvasMap	= document.createElement('canvas')
		canvasMap.width	= imageMap.width
		canvasMap.height= imageMap.height
		var contextMap	= canvasMap.getContext('2d')
		contextMap.drawImage(imageMap, 0, 0)
		var dataMap	= contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

		// load earthcloudmaptrans
		var imageTrans	= new Image();
		imageTrans.addEventListener("load", function(){
			// create dataTrans ImageData for earthcloudmaptrans
			var canvasTrans		= document.createElement('canvas')
			canvasTrans.width	= imageTrans.width
			canvasTrans.height	= imageTrans.height
			var contextTrans	= canvasTrans.getContext('2d')
			contextTrans.drawImage(imageTrans, 0, 0)
			var dataTrans		= contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
			// merge dataMap + dataTrans into dataResult
			var dataResult		= contextMap.createImageData(canvasMap.width, canvasMap.height)
			for(var y = 0, offset = 0; y < imageMap.height; y++){
				for(var x = 0; x < imageMap.width; x++, offset += 4){
					dataResult.data[offset+0] = dataMap.data[offset+0]
					dataResult.data[offset+1] = dataMap.data[offset+1]
					dataResult.data[offset+2] = dataMap.data[offset+2]
					dataResult.data[offset+3] = 255 - dataTrans.data[offset+0]
				}
			}
			// update texture with result
			contextResult.putImageData(dataResult,0,0)	
			material.map.needsUpdate = true;
		})
		imageTrans.src	= 'images/fair_clouds_4k.jpg';
	}, false);

	imageMap.src	= 'images/fair_clouds_4k.jpg';

	var geometry	= new THREE.SphereGeometry(0.51, 32, 32)
	var material	= new THREE.MeshPhongMaterial({
		map		: new THREE.Texture(canvasResult),
		side		: THREE.DoubleSide,
		transparent	: true,
		opacity		: 0.8,
	})
	var cloudMesh = new THREE.Mesh(geometry, material);

	/*

	scene.add(cloudMesh)
	onRenderFcts.push(function(delta, now){
		cloudMesh.rotateY( 1/32 * delta )
	})
	
	*/	



	//////////////////////////////////////////////////////////////////////////////////
	//		add star field							//
	//////////////////////////////////////////////////////////////////////////////////
	
	var geometry  = new THREE.SphereGeometry(90, 32, 32)
	var material  = new THREE.MeshBasicMaterial()
	material.map   = THREE.ImageUtils.loadTexture('images/starfield_4k.jpg')
	material.side  = THREE.BackSide
	var mesh  = new THREE.Mesh(geometry, material)
	scene.add(mesh)



	//////////////////////////////////////////////////////////////////////////////////
	//		Camera Controls							//
	//////////////////////////////////////////////////////////////////////////////////
	var mouse	= {x : 0, y : 0}
	document.addEventListener('mousemove', function(event){
		mouse.x	= (event.clientX / window.innerWidth ) - 0.5
		mouse.y	= (event.clientY / window.innerHeight) - 0.5
	}, false)
	onRenderFcts.push(function(delta, now){
		camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3)
		camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3)
		camera.lookAt( scene.position )
	})


	//////////////////////////////////////////////////////////////////////////////////
	//		render the scene						//
	//////////////////////////////////////////////////////////////////////////////////
	onRenderFcts.push(function(){
		renderer.render( scene, camera );		
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		loop runner							//
	//////////////////////////////////////////////////////////////////////////////////
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000)
		})
	})