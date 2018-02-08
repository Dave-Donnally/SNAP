(function() {

	var fontStyleValues = ['normal', 'italic'];
	var fontVariantValues = ['normal', 'small-caps'];
	var fontWeightValues = ['normal', 'bold'];
	var fontFamilyValues = ['Finger Paint', 'Barrio', 'Fredericka the Great', 'Shadows Into Light', 'Quicksand'];
	var textAlignValues = ['center', 'left', 'right'];

	Promise
		.resolve()
		.then(function() {
			return Promise.all(fontFamilyValues.map(function(fontFamily) {
				return (new FontFaceObserver(fontFamily)).load();
			}));
		})
		.catch(function() {
			// continue regardless of error
		})
		.then(function() {
			var n = 1;

			var renderer = new THREE.WebGLRenderer({antialias: true});
			renderer.setClearColor(0x588c7e);
			document.body.appendChild(renderer.domElement);

			var scene = new THREE.Scene();

			var camera = new THREE.PerspectiveCamera(75, 1);
			camera.position.set(0, 0, 3*n);

			var texture = new THREE.TextTexture({
				text: [
					'Twinkle, twinkle, little star,',
					'How I wonder what you are!',
					'Up above the world so high,',
					'Like a diamond in the sky.',
				].join('\n'),
				fontStyle: fontStyleValues[0],
				fontVariant: fontVariantValues[0],
				fontWeight: fontWeightValues[0],
				fontSize: 32,
				fontFamily: fontFamilyValues[0],
				textAlign: textAlignValues[0],
			});
			var material = new THREE.MeshBasicMaterial({
				map: texture,
				color: 0xf2e394,
				transparent: true,
			});
			var geometry = new THREE.PlaneGeometry(4*n, 4*n, 4*n);
			var mesh = new THREE.Mesh(geometry, material);
			scene.add(mesh);

			var updateMeshScale = function() {
				mesh.scale.set(1, 1/material.map.aspect, 1);
			};

			var rotateMesh = (function() {
				var nextStep = function(step, value, minValue, maxValue) {
					return step * ((value < minValue || value > maxValue) ? -1 : 1);
				};
				var x = 1/800;
				var y = 1/600;
				var z = 1/400;

				return function() {
					mesh.rotation.x += (x = nextStep(x, mesh.rotation.x, -1/7, 1/3));
					mesh.rotation.y += (y = nextStep(y, mesh.rotation.y, -1/7, 1/3));
					mesh.rotation.z += (z = nextStep(z, mesh.rotation.z, -1/7, 1/3));
				};
			})();

			var renderScene = function() {
				rotateMesh();
				updateMeshScale();
				renderer.setSize(document.body.clientWidth, document.body.clientHeight);
				camera.aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight;
				camera.updateProjectionMatrix();
				renderer.render(scene, camera);
			};

			window.addEventListener('resize', renderScene, false);

			var startToRenderScene = function() {
				setTimeout(function() {
					requestAnimationFrame(startToRenderScene);
				}, 1000/60);
				renderScene();
			};
			startToRenderScene();

			var gui = new dat.GUI();
			(function() {
				var guiFolder = gui.addFolder('texture');
				//guiFolder.add(texture, 'text');
				guiFolder.add(texture, 'fontStyle', fontStyleValues);
				guiFolder.add(texture, 'fontVariant', fontVariantValues);
				guiFolder.add(texture, 'fontWeight', fontWeightValues);
				guiFolder.add(texture, 'fontSize', 0, 128, 1);
				guiFolder.add(texture, 'fontFamily', fontFamilyValues);
				guiFolder.add(texture, 'textAlign', textAlignValues);
				guiFolder.add(texture, 'lineHeight', 0, 3, 1/20);
				guiFolder.add(texture, 'padding', 0, 1, 1/20);
				guiFolder.open();
			})();
			(function() {
				var guiFolder = gui.addFolder('material');
				guiFolder.add(material, 'transparent');
				guiFolder.open();
			})();

			var settings = QuickSettings.create(16, 16, ' ');
			settings.bindTextArea('text', texture['text'], texture);
			/*settings.bindDropDown('fontStyle', fontStyleValues, texture);
			settings.bindDropDown('fontVariant', fontVariantValues, texture);
			settings.bindDropDown('fontWeight', fontWeightValues, texture);
			settings.bindRange('fontSize', 0, 128, texture['fontSize'], 1, texture);
			settings.bindDropDown('fontFamily', fontFamilyValues, texture);
			settings.bindDropDown('textAlign', textAlignValues, texture);
			settings.bindRange('lineHeight', 0, 3, texture['lineHeight'], 1/20, texture);
			settings.bindRange('padding', 0, 1, texture['padding'], 1/20, texture);
			settings.bindBoolean('transparent', material['transparent'], material);*/
		});

})();