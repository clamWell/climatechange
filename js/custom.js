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

	/******** three.js 글로브 ********/
	function makeThreeGlobe(){

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
		camera.position.z = 1.8;
		
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

	/******** 도입부 평년 기온차 선 그래프********/
	function korTempPoleGraph(){
		var data = koreaTempDevi,
			width =  ((isMobile==true)? (screenWidth-120) : 900),
			height = 500,
			margin = 10,
			poleMargin = 2;
			poleWidth = ((width-margin) / data.length)-poleMargin;
	
		var devi_val = data.map(function(d) {
		  return Number(d["deviation"]);
		});
		//console.log(devi_val);

		var maxValue = d3.max(devi_val);
		var minValue = d3.min(devi_val);
		console.log("편차 max값은: "+ maxValue +" / 편차 min값은: "+minValue);

		var chart_svg = d3.select("#YEAR_DEVI_POLE_CHART");
		chart_svg.attr("width", width +"px" )
				.attr("height", height +"px");

		var chart_holder = chart_svg.append("g")
				.attr("class","chart-holder");

		var x = d3.scaleTime()
				.range([0, width])
				.domain([new Date(1973, 0, 1), new Date(2019, 0, 1)])

		var y = d3.scaleLinear()
				.range([height, 0])
				.domain([minValue, maxValue])
			
		chart_holder.append("g")
		  .attr("class", "y axis")
		  .attr("transform", "translate(-10,0)")
		  .call(d3.axisLeft(y).ticks(5));

		chart_holder.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0,"+ (height+20)+")")
		  .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")).ticks(4));

		var pole_holder = chart_holder.append("g")
		  .attr("class", "pole-holder")
		  .attr("transform", "translate(0,"+ -280 +")")

		var pole_year_avr = pole_holder.selectAll("g")
				.data(data)
				.enter().append("g")
				.attr("class","pole-g")
				.attr("transform", function(d, i) {
					var transX = ( i * (poleWidth  + poleMargin) );
					return "translate("+ transX +",0)";}
				 );

		var getPoleColor = function(t){
			if (t<=0){
				//return "#6bb8d8";
				return "url(#coldGrad)";
			}else{
				//return "#ff8a15";
				return "url(#warmGrad)";
			}
		};
		
		var minMaxSum = Number(maxValue) + Number(Math.abs(minValue)); 
		var multipleKey =  height/minMaxSum;

		pole_year_avr.append("rect")
				.style("fill", function(d) {
					return getPoleColor(d["deviation"]);
				})
				.attr("width", poleWidth)
				.attr("class", "pole pole-each-year-avr")
				.attr("height", function(d){
					var h = Math.abs( Number(d["deviation"]) ) * multipleKey;
					if(h<4){ h = 4;}
					return h;
				}).attr("x", function(d, i) {
					return 0;
				}).attr("y", function(d) {
					if(Number(d["deviation"]) <= 0){
						return height;
					}else{
						var h = Math.abs( Number(d["deviation"]) ) * multipleKey;
						if(h<4){ h = 4;}
						return height-h;
					}
				});
			
		pole_year_avr.append("text")
				.attr("class","pole-label")
				.text(function(d) { return Number(d["deviation"]).toFixed(2) +"℃"; })
				.attr("transform", function(d, i) { 
					var labelTransY;
					var h = Math.abs( Number(d["deviation"]) ) * multipleKey;
					if(Number(d["deviation"]) <= 0){
						labelTransY = height + h + 5;;
					}else{
						if(h<4){ h = 4;}
						labelTransY = height-h -5;
					}
					return "translate(5," +labelTransY+")";
				})

		var $tooltip = $("#TOOLTIP_YEAR_DEVI");
		$tooltip.css({"opacity":"0"});
		pole_year_avr.on("mouseenter", function(d) {
					d3.selectAll("#YEAR_DEVI_POLE_CHART .pole").style("fill-opacity", "0.4")
					d3.select(this).selectAll(".pole")
						.style("fill-opacity", "1")
						.style("stroke", "#333")

					d3.select(this).selectAll(".pole-label")
						.style("fill-opacity", "1")

					$tooltip.find(".year span").html(d["year"]);
					$tooltip.find(".temp_avr .value").html(d["temp_avr"]);
					$tooltip.find(".temp_devi .value").html(d["deviation"]);
					$tooltip.find(".temp_devi .value").removeClass("value-cold value-warm");
					if(d["deviation"]<0){
						$tooltip.find(".temp_devi .value").addClass("value-cold");
					}else if(d["deviation"]>=0){
						$tooltip.find(".temp_devi .value").addClass("value-warm");
					}
					$tooltip.css({"left":(d3.mouse(this.parentNode)[0])+"px"});
					$tooltip.css({"bottom":"-20px"});
					$tooltip.css({"opacity":"1"})

				}).on("mouseleave", function(d){
					d3.selectAll("#YEAR_DEVI_POLE_CHART .pole")
						.style("fill-opacity", null)
						.style("stroke", null)
						.style("stroke-width",  null)
					$tooltip.css({"opacity":"0"})
					d3.selectAll("#YEAR_DEVI_POLE_CHART .pole-label")
						.style("fill-opacity", null)
				});		


	}	
	korTempPoleGraph();

	/******** 도입부 평년 기온차 선 그래프********/

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
	var showHeader = function() {
		$(".common_header").delay(500).animate({"top": "0px"}, 1000, "swing");
	}
	function activataTw(){
		$("#TT_HOLDER_01").twentytwenty();
		$("#TT_HOLDER_02").twentytwenty();
	};

	
	$(".twentytwenty-container").on("mousedown", function(){
		$(this).parent("div").siblings(".click-animation").fadeOut();
	});

	function init(){
		showHeader();
		activataTw();
	}

	$(".loading-page").fadeOut(200, function(){
		init();
	});


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
