$(function(){
	var ieTest = false,
		screenWidth = $(window).width(),
		screenHeight = $(window).height(),
		imgURL = "http://img.khan.co.kr/spko/storytelling/2020/massmedia/",
		isMobile = screenWidth <= 800 && true || false,
		isNotebook = (screenWidth <= 1300 && screenHeight < 750) && true || false,
		isMobileLandscape = ( screenWidth > 400 && screenWidth <= 800 && screenHeight < 450 ) && true || false;
	window.onbeforeunload = function(){ window.scrollTo(0, 0) ;}
	var randomRange = function(n1, n2) {
		return Math.floor((Math.random() * (n2 - n1 + 1)) + n1);
	};
	$(window).resize(function() {
		screenWidth = $(window).width();
		screenHeight = $(window).height();
		checkIfProgressOverflow(screenWidth);
    });


	$(".close-ie-block").on("click", function(){
		$(".ie-block-9").hide();
	})


	function checkIfProgressOverflow(sw){
		if(sw<1200){
			$(".fixed-navi").stop().animate({"opacity":"0.2", "z-index":"-1"}, 300);

		}else{
			$(".fixed-navi").stop().animate({"opacity":"1","z-index":"1"}, 300);
		}
	}

	

	/********progress********/
	var progressBar = {
		progressStatus : false,
		showProgress : function(){
			$(".fixed-navi").stop().animate({"right":"10px"},500);
		},
		hideProgress : function(){
			$(".fixed-navi").stop().animate({"right":"-200px"},500);
		},
		setProgress : function(sc){
			var fullProgress = $(document).height()-$(window).height()-( $(".footer-area").height()+$(".digital-list").height() +$(".common-footer").height());
			var ScrollPer = (sc/fullProgress)*100;
			if( (sc<$(".sec--01").offset().top || sc > fullProgress) && (this.progressStatus == true)){
				this.progressStatus = false;
				this.hideProgress();
			}else if((sc>=$(".sec--01").offset().top && sc <= fullProgress) && (this.progressStatus == false) ){
				this.progressStatus = true;
				this.showProgress();
			}

			if(isMobile==true){
				$(".progress").css({"width":ScrollPer+"%"});
			}else {
				$(".progress").css({"height":ScrollPer+"%"});
			}

		}
	}
	/********progress********/

	/******** 모바일 전용 조정 ********/
	if(isMobile==true){
		
	}
	/******** 모바일 전용 조정 ********/

	function init(){
	
	}

	$(".loading-page").fadeOut(200, function(){
		init();
	});


	/******** three.js 글로브 ********/
	function makeThreeGlobe(){
		/*
		 const Globe = new ThreeGlobe()
		.globeImageUrl('https://unpkg.com/three-globe@2.8.7/example/img/earth-blue-marble.jpg')
		.bumpImageUrl('https://unpkg.com/three-globe@2.8.7/example/img/earth-topology.png')
		*/
	
		var geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
		var material =new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/earth-blue-marble-sm.jpg'),
			//bumpMap: THREE.ImageUtils.loadTexture('img/earth-topology.jpg'),
			//bumpScale: 0.005,
		  })
		var Globe = new THREE.Mesh( geometry, material );

		// Setup renderer
		const renderer = new THREE.WebGLRenderer();
		const container = document.getElementById("threeJsGlobe");
		const { width, height } = container.getBoundingClientRect();
		renderer.setSize(width, height);
		container.appendChild(renderer.domElement);

		// Setup scene
		const scene = new THREE.Scene();
		scene.background = new THREE.Color("#111");
		scene.add(Globe);


		var amb_light = new THREE.AmbientLight("#ffc66b",1);
		amb_light.position.set(5,3,5)
		var dir_light = new THREE.DirectionalLight("#bdf5ff", 0.5);
		var change_light = new THREE.AmbientLight("#ff2a00", 0);
		//amb_light.castShadow = true;
		scene.add(amb_light)
		scene.add(dir_light)
		scene.add(change_light)

		// Setup camera
		const camera = new THREE.PerspectiveCamera();
		camera.aspect = width/height;
		camera.updateProjectionMatrix();
		camera.position.z = 2;

		// Add camera controls
		/*
		const tbControls = new THREE.TrackballControls(camera, renderer.domElement);
		tbControls.minDistance = 101;
		tbControls.rotateSpeed = 5;
		tbControls.zoomSpeed = 0.8;*/
		
		var it = 0;
		var dir = 1;
		// Kick-off renderer
		(function animate() { // IIFE
			requestAnimationFrame(animate);

			// Frame cycle
			//tbControls.update();
			Globe.rotation.x += 0.001;
			Globe.rotation.y += 0.002;

			//Globe.rotation.z += 0.01;
			if(it<1){
				it += 0.002;
				change_light.intensity = it;
			}else if(it>=1){

			}

			renderer.render(scene, camera);
		})();
	
	}
    makeThreeGlobe();
	/******** three.js 글로브 ********/


	$(window).scroll(function(){
		var nowScroll = $(window).scrollTop();
		var nowScrollWithCon = nowScroll+screenHeight*0.6;
		progressBar.setProgress(nowScroll);
	
		$(".hideme").each(function(i){
			if( nowScroll + screenHeight > $(this).offset().top + $(this).outerHeight()*0.5 ){
				$(this).stop().animate({"opacity":"1"},500);
			}
		});


	});


});

function sendSns(s) {
  var url = encodeURIComponent(location.href),
	  txt = encodeURIComponent($("title").html());
  switch (s) {
    case 'facebook':
      window.open('http://www.facebook.com/sharer/sharer.php?u=' + url);
      break;
    case 'twitter':
      window.open('http://twitter.com/intent/tweet?text=' + txt + '&url=' + url);
      break;
  }
}
