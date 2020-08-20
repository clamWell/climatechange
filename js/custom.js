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
			map: THREE.ImageUtils.loadTexture('img/earth-blue-marble-low.jpg'),
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
			width =  ((isMobile==true)? (screenWidth-60) : 900),
			height = ((isMobile==true)? 400: 500),
			margin = 10,
			poleMargin = 2;
			poleWidth = ((width-margin) / data.length)-poleMargin;
	
		var devi_val = data.map(function(d) {
		  return Number(d["deviation"]);
		});
		//console.log(devi_val);

		var maxValue = d3.max(devi_val);
		var minValue = d3.min(devi_val);
		//console.log("편차 max값은: "+ maxValue +" / 편차 min값은: "+minValue);

		var chart_svg = d3.select("#YEAR_DEVI_POLE_CHART");
		chart_svg.attr("width", width +"px" )
				.attr("height", height +"px");

		var chart_holder = chart_svg.append("g")
				.attr("class","chart-holder");
		if(isMobile==true){ chart_holder.attr("transform", "translate(15,0)");  }

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
		  .attr("transform", "translate(0,"+ -(height/2+30) +")")

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
					
					if(isMobile==false){
						$tooltip.css({"left":(d3.mouse(this.parentNode)[0])+"px"});
						$tooltip.css({"bottom":"-20px"});

					}
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

		$(".all-city-household-chart .tooltip .close-btn").on("click", function(){
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

	/******** 최근 10년 산불 발생 현황 선, 막대 그래프********/
	function curFireLInePole(){
		var data=[{year:"2010",occu:"282",ha:"297"},{year:"2011",occu:"277",ha:"1090"},{year:"2012",occu:"197",ha:"72"},{year:"2013",occu:"296",ha:"552"},{year:"2014",occu:"492",ha:"137"},{year:"2015",occu:"623",ha:"418"},{year:"2016",occu:"391",ha:"378"},{year:"2017",occu:"692",ha:"1480"},{year:"2018",occu:"496",ha:"894"},{year:"2019",occu:"653",ha:"3255"}];
		
		var	width =  ((isMobile==true)? (screenWidth-80) : 650),
			height = ((isMobile==true)? 300: 350),
			margin = 10,
			poleMargin = 2;
			poleWidth = ((width) / data.length)-poleMargin;
	
		var haMax = d3.max(data, function(d){ return Number(d["ha"]); }); 
		var occuMax = d3.max(data, function(d){ return Number(d["occu"]); }); 
		var multipleKey = [ height/haMax, height/occuMax];

		var chart_svg = d3.select("#CURRENT_FIRE_LINE_POLE");
		chart_svg.attr("width", width +"px" )
				.attr("height", height +"px");

		var pole_chart_holder = chart_svg.append("g")
				.attr("class","pole_chart_holder");
		var line_chart_holder = chart_svg.append("g")
				.attr("class","line_chart_holder");

		var x = d3.scaleBand()
			.domain(data.map(function(d){ return d.year; }) )
			.range([0, width]);

		chart_svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0,"+ (height+10)+")")
		  .call( d3.axisBottom(x))
		
		d3.selectAll("#CURRENT_FIRE_LINE_POLE .x .tick")
			.filter(function(d){ return d.year === "2019"})
			.classed("tick-strong", true);

		var y_ha = d3.scaleLinear()
			.domain([0, haMax])
			.rangeRound([height, 0])

		chart_svg.append("g")
		  .attr("class", "y axis axis-ha")
		  .attr("transform", "translate("+(width)+",0)")
		  .call(d3.axisRight(y_ha).ticks(5));

		var y_occu = d3.scaleLinear()
			.domain([0, occuMax])
			.rangeRound([height, 0])

		var yaxis = chart_svg.append("g")
		  .attr("class", "y axis axis-occu")
		  .attr("transform", "translate(-10,0)")
		  .call(d3.axisLeft(y_occu).ticks(5));

		if(isMobile==true){ yaxis.attr("transform", "translate(-5,0)") }

		var pole_g = pole_chart_holder.selectAll("g")
				.data(data)
				.enter().append("g")
				.attr("class","pole-g")
				.attr("transform", function(d, i) {
					var transX = ( i * (poleWidth  + poleMargin) );
					return "translate("+ transX +",0)";}
				 );

		pole_g.append("rect")
				.style("fill", function(d) {
					return "url(#warmGrad)";
				})
				.attr("width", poleWidth)
				.attr("class", "pole pole-each-ha")
				.attr("height", function(d){
					var h = d.ha * multipleKey[0];
					return h;
				}).attr("x", function(d, i) {
					return 0;
				}).attr("y", function(d) {
					var h = d.ha *  multipleKey[0];
					return height-h;
				});

		pole_g.append("text")
				.attr("class","pole-label")
				.text(function(d) { return d.ha; })
				.attr("transform", function(d){ 
					var h = d.ha *  multipleKey[0];
					return "translate("+poleWidth/2+","+(height-h+15) +")";
				})

		chart_svg.append("text")
			.attr("class", "y-label-ha")
			.attr("transform", "translate("+ ((width)-5) +",0)")
			.text("면적(ha)")

		var line = d3.line()
			.x(function(d){ return (x(d.year) + x.bandwidth()/2); })
			.y(function(d){ return y_occu(d.occu); } )

		line_chart_holder.append("path")
		  .attr("fill", "none")
		  .attr("class", "line-path")
		  .attr("d", line(data));

		chart_svg.append("text")
			.attr("class", "y-label-occu")
			.attr("transform", "translate(-35,0)")
			.text("발생건수(건)")

		dotHolder = line_chart_holder.selectAll("g.dot-holder")
				.data(data)
			  .enter().append("g")
				.attr("class", "dot-holder")
				.attr("transform", function(d){ return "translate("+(x(d.year) + x.bandwidth()/2)+","+y_occu(d.occu)+")"; })

		var dot = dotHolder.append("circle") 
				.attr("class", "dot") 
				.attr("r", 4);

		var dotLabel = dotHolder.append("text") 
			.attr("class","dot-label")
			.attr("transform","translate(0, -10)")
			.text(function(d) { return d.occu+"건"; });

		dot.on("mouseover", function(d){
			d3.select(this)
				.style("stroke-width", "3")
				.style("r", 5)
				.style("fill", "#111")
			d3.select(this.parentNode).select(".dot-label")
				.style("opacity",1)
			d3.select(".pole_chart_holder")
				.style("opacity", 0.3)
		}).on("mouseout", function(d){
			d3.select(this)
				.style("stroke-width", null)
				.style("r", null)
				.style("fill", null)
			d3.select(this.parentNode).select(".dot-label")
				.style("opacity",0)
			d3.select(".pole_chart_holder")
				.style("opacity", null)
		})
	}
	curFireLInePole();
	/******** 최근 10년 산불 발생 현황 선, 막대 그래프********/

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

	/******** 섹션 타이틀 애니메이션 ********/  //추후 객체화 할 것
	var st_ani_done = [false, false, false, false, false, false],
		pathWidthArr = [];
	$(".sec-title-artic .path").each(function(i){
		var pathWidth = $(this).find("img").width();
		pathWidthArr.push(pathWidth);
	});
	function sectionTitleAnimation(i){
		console.log(i+"번째 섹션 타이틀 애니메이션");
		var $stItem = $(".sec-title").eq(i).find("p");
		for(s=0; s<$stItem.length;s++){
			$stItem.eq(s).delay(s*400).animate({"opacity":"1", "top":"0px"}, 1000, "easeOutSine");
		}
		if(i>0){
			 $(".sec-title").eq(i).find(".path").animate({"width":pathWidthArr[i-1]}, 2000, "easeOutSine");
		}
	};
	
	function setTitleConPos(){
		$(".over-video").each(function(i){
			$(this).css({"top": (($(".sec-title-with-video").eq(i).height()-$(this).height())/2-30)+"px"});
		});
	}
	/******** 섹션 타이틀 애니메이션 ********/


	/******** 모바일 전용 조정 ********/	
	function changeSource(id, url) {
	   var video = document.querySelector(id);
	   var source = video.querySelector("source");
	   video.src = url;
	   video.play();
	}

	if(isMobile==true){
		$("#IMG_S01_01").find("img").attr("src","img/sec-00-seoul-climate-photo-bridge.jpg");
		$("#IMG_S01_01").find(".caption").html("팔당, 소양강 댐 방류로 한강 수위가 높아지면서 8월 6일 서울 여의도 부근 올림픽대로 일부 구간이 침수돼 차량통행이 통제되고 있다.");
		$("#IMG_S02_01").find("img").attr("src","img/sec-01-growh-photo-m.jpg");

		changeSource("#V_JEJU", "video/jeju_title_m.mp4")
		changeSource("#V_MOUNT", "video/tree_title_m.mp4")
		changeSource("#V_FIRE", "video/fire_title_m.mp4")
		changeSource("#V_GROUND", "video/jeju_title_m.mp4")
	}else{
		changeSource("#V_JEJU", "video/jeju_4k_title_video_final.mp4")
		changeSource("#V_MOUNT", "video/tree_title_video.mp4")
		changeSource("#V_FIRE", "video/video/fire_title_video_4.mp4.mp4")
		changeSource("#V_GROUND", "video/ground_bee_title_video.mp4")
	}
	/******** 모바일 전용 조정 ********/


	var showHeader = function() {
		$(".common_header").delay(1800).animate({"top": "0px"}, 1500, "swing");
	}
	function activataTw(){
		$("#TT_HOLDER_01").twentytwenty();
		$("#TT_HOLDER_02").twentytwenty();
	};

	$(".twentytwenty-container").on("mousedown", function(){
		$(this).parent("div").siblings(".click-animation").fadeOut();
	});
	$(".twentytwenty-container").on("touch", function(){
		$(this).parent("div").siblings(".click-animation").fadeOut();
	});

	function introAnimation(){
		var $introItem = $(".intro-fadeTo");
		//$(".story-top-graphic .cover-shadow").animate({"opacity":"0.2"},2000);
		for(o=0; o<$introItem.length;o++){
			$introItem.eq(o).delay(o*200).animate({"opacity":"1", "top":"0px"}, 1000, "easeOutSine");
			if(o == $introItem.length-1){
				showHeader();
			}
		};
	}



	function init(){
		activataTw();
		introAnimation();
		setTitleConPos();
	}

	$(".loading-page").fadeOut(200, function(){
		init();
	});

	$(window).scroll(function(){
		var nowScroll = $(window).scrollTop();
		var nowScrollWithCon = nowScroll+screenHeight*0.6;
		progressBar.setProgress(nowScroll);
	
		$(".hideme").each(function(i){
			if( $(this).hasClass("shown") == false && nowScroll + screenHeight > $(this).offset().top + $(this).outerHeight()*0.5 ){
				$(this).addClass("shown")
				$(this).stop().animate({"opacity":"1"},500);
			}
		});

		$(".sec-title").each(function(i){
			if( nowScroll + screenHeight > $(this).offset().top + $(this).outerHeight()*0.5 && st_ani_done[i] !== true ){
				st_ani_done[i] = true;
				sectionTitleAnimation(i);
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
