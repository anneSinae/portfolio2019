/*
 * Create by Sinae Yu :
 * https://github.com/anneSinae/portfolio2019.git
 */

$(document).ready(function() {
	fixHeaderTop();
	visualWeatherInfo();
	loadVisualShapePath();
	showContent(".btn_nav, .btn_message, .btn_aboutme, .btn_publishing, .btn_design, .btn_others");
	setMobileBrowser();
	loadPortfolio(".con.design");
	scrollAnimate([
		{target : ".con .type.createSite, .con .type.other", scrollTopBegin : 600, speed : 1000, aniFrom : {"marginTop":"-200px"}, aniTo : {"marginTop":0}, useW : 1024, back : true},
		{target : ".con .type.maintanance", scrollTopBegin : 600, speed : 1000, aniFrom : {"marginTop":"200px"}, aniTo : {"marginTop":0}, useW : 1024, back : true},
		{target : ".con.publishing h2", scrollTopBegin : 0, speed : 700, aniFrom : {paddingLeft:"70px"}, aniTo : {paddingLeft:0}},
		{target : ".con.design h2", scrollTopBegin : 1050, speed : 700, aniFrom : {paddingLeft:"70px"}, aniTo : {paddingLeft:0}},
		{target : ".con.publishing .descript", scrollTopBegin : 0, speed : 700, delay : 100, aniFrom : {top:"30px"}, aniTo : {top:0}},
		{target : ".con.design .descript", scrollTopBegin : 1050, speed : 700, delay : 100, aniFrom : {top:"30px"}, aniTo : {top:0}}
	]);

	/* 메인에서 퍼블리싱종류 클릭시 해당위치로 스크롤이동위한 세팅 */
	$(".con.publishing .works a").on("click", function() {
		$(this).addClass("active");
	})
});


/* 메뉴바영역 상단고정 : fix header on top */
function fixHeaderTop() {
	var target = "#header";
	var scrollState = 0;
	$(window).on("scroll", showTopBar);
	function showTopBar() {
		if($(this).scrollTop() > 300) {
			if(scrollState != 1) {
				$(target).addClass("fix");
				scrollState = 1;
			}
		} else if(scrollState == 1 && $(this).scrollTop() === 0) {
			$(target).removeClass("fix");
			scrollState = 0;
		}
	}
}


/* 비쥬얼 shape path 로딩 : load visual svg shape animation path */
function loadVisualShapePath() {
	$.getJSON("js/visual_svgPath.json", function(path) {
		$(".svgAni path animate").attr("values", path.svg_aniPath.join(";"));
    });
}


/* 비쥬얼영역 날씨정보 : visual area weather information */
function visualWeatherInfo() {
	var areaInfo = {"lat":35.02, "lon":126.8};
	$.getJSON( "http://api.openweathermap.org/data/2.5/weather?lat=" + areaInfo.lat + "&lon=" + areaInfo.lon + "&appid=6225d03d1b4772f4d0e658d384e6efe2", function(data) {
	  $("#visual").attr("class", data.weather[0].main.toLowerCase());
	  $(".weather").text(getWeatherTxt(data.weather[0].main));
	  $(".temper b").text(data.main.temp - 273.15);
	  $(".wind b").text(data.wind.speed);
	});
	function getWeatherTxt(txt) {
		switch(txt) {
			case "Clear" : return "맑음";
			case "Clouds" : return "구름";
			case "Rain" : return "비";
			case "Drizzle" : return "비";
			case "Snow" : return "눈";
			default : return "맑음";
		}
	}
}


/* 메뉴활성화화면 세팅 : set active for hidden contents */
function showContent(target, info) {
	$(target).on("click", function(e) {
		e.preventDefault();
		var activeTxt = $(this).get(0).className.split("btn_")[1];
		var $typeInfoTargt =$(this).parents(".type");
		chkOtherAction(activeTxt, 
			!!$typeInfoTargt.length && {
				"type" : $(this).parents(".type").attr("class").split(" ")[1], 
				"num" : $(this).data("num")
			}
		);
		$("body").addClass("active_" + activeTxt);
		if($(this).attr("class") !== "btn_nav") $("body").removeClass("active_nav");
	});

	closeCurrentDiv();
	goIndex();
	function chkOtherAction(activeTxt, info) {
		if(activeTxt === "publishing" || activeTxt === "design") {
			loadPortfolio(".list." + activeTxt);
			$("body, html").scrollTop(0);
			setWrapH(true);
			$("body").attr("class", "");
			return;
		};
		if(activeTxt === "detailDesign") {
			loadPortfolio(".detail.design", info);
			$("html").css("overflow-y", "hidden");
			$(".detail.design .btn_close").on("click", function() {
				$("html").css("overflow-y", "scroll");
			});
			return;
		}
		if(activeTxt === "others") {
			alert("기타 다른 작업물 준비중입니다.");
			return;
		}
	}
}


/* 현재컨텐츠 닫기 : close current div layer */
function closeCurrentDiv() {
	$(".btn_close").on("click", function(e) {
		$("body").removeClass($(this).attr("href"));
		e.preventDefault();
	});
}


/* 처음화면 가기(스크롤 top이동) : go index and scroll top */
function goIndex() {
	$(".go_index").on("click", function(e) {
		$("body, html").stop().prop("class", "").animate({scrollTop:0}, 300);
		setWrapH(false);
		e.preventDefault();
	});
}


/* 스크롤시 컨텐츠 등장 애니메이션 : animation for coming out when scrolling */
function scrollAnimate(arguments) {
	$.each(arguments, function(index, data) {
		data.aniFrom["opacity"] = 0;
		data.aniTo["opacity"] = 1;
		var scrollState = 0;
		if(chkWinOk(data)) $(data.target).css(data.aniFrom).css("position","relative");
		if(data.scrollTopBegin == 0) $(data.target).animate(data.aniTo, data.speed, "swing");
		else {
			$(document).on("scroll", function() {
				if(!chkWinOk(data)) {
					$(data.target).css(data.aniTo, data.target);
				} else {
					if(($(document).scrollTop()) >= data.scrollTopBegin) {
						if(!scrollState) {
							scrollState = 1;
							$(data.target).delay(!!data.delay ? data.delay : 0).animate(data.aniTo, data.speed, "swing");
						}
					} else if(!!scrollState && !!data.back) {
						scrollState = 0;
						$(data.target).css(data.aniFrom);
					}
				}
			});
		}
	});
	function chkWinOk(data) {
		return $(window).width() > (!!data.useW ? data.useW : 0);
	}
}



/* 포트폴리오 컨텐츠(퍼블리싱, 디자인) Json로딩 : load Json portfolio contents(publishing, design) */
function loadPortfolio(target, info) {
	switch(target) {
		case ".con.design" : randerMainCon(target, "design"); break;
		case ".list.publishing" : randerPPList(target, "publishing"); break;
		case ".list.design" : randerPPList(target, "design"); break;
		case ".detail.design" : randerPPDetailDesign(target, "design", info); break;
		default : alert("로딩을 위한 데이터정보가 없습니다.");
	}
	function randerMainCon(target, ppType) {
		var $listUl = $("<ul>").insertAfter($(target).find(".works .tit_sub"));
		$.getJSON("js/pp_" + ppType + ".json", function(data) {
			$.each(data, function(key, type) {
				var formLi = "<li class='type'><a href='#' title='' class='btn_detailDesign'><img></a></li>";
				$.each(type.typeList, function(idx, list) {
					if(!!list.mainPosi) {
						var $currLi = $listUl.append(formLi).children("li:last-child").addClass(key);
						$currLi.find("img").attr("src", "images/" + list.imgThumb).attr("alt", list.tit + " image").load(function() {
							setSquare(".con.design .works li");
						});
						$currLi.find("a").prop("title", list.tit + " 자세히 보기").attr("data-num", idx);
					}
				});
			});
			showContent("li .btn_detailDesign");
		});
	}
	function randerPPList(target, ppType) {
		if(!!$(target).find(".tit").text()) return;
		$.getJSON("js/pp_" + ppType + ".json", function(data) {
			var unit = ".type";
			var $sample = $(target).find(unit).first();
			$.each(data, function(key, type) {
				var $type = $sample.clone().find("ul").empty().parent(unit);
				var $currType = $(target).append($type).find(unit).last();
				$currType.addClass(key);
				$currType.find(".tit h4").text(type.typeTit);
				$currType.find(".tit span").text(type.typeTxt);
				type.typeList.forEach(function(list) {
					var $currLi = $currType.find("ul").append($sample.find("li").clone().find(".sub").empty().parents("li")).find("li").last();
					!!list.imgThumb ? $currLi.find(".img img").attr("src", "images/" + list.imgThumb) : $currLi.find(".img").remove();
					$currLi.find(".img img").load(function() { 
						setMasonry(target + " ul"); 
					});
					$currLi.find(".info dt").text(list.tit);
					$currLi.find(".info .info_detail").text(list.note);
					if(ppType === "publishing") {
						$currLi.find(".info .info_url a").text(list.url).attr("href", list.url);
					}
					ppType === "design" && $currLi.addClass("btn_detailDesign").attr("data-num", $currLi.index());
					if(!!list.imgSubThumb) {
						list.imgSubThumb.forEach(function(imgSub) {
							$("<img>").appendTo($currLi.find(".info .sub")).attr("src", "images/" + imgSub).attr("alt", list.tit + " image");
						});
					} else $currLi.find(".info .sub").remove();
				});
				var arrKeys = Object.keys(data);
				if(key === arrKeys[arrKeys.length-1]) $sample.remove();
			});
			showContent("ul li.btn_detailDesign");

			/* 메인에서 퍼블리싱종류 클릭시 해당위치로 스크롤이동 */
			if(ppType === "publishing") {
				var activeTarget = ".con.publishing .works a.active";
				var mainClickTxt = $(activeTarget).attr("class").split(" ")[1];
				console.log(mainClickTxt);
				$("html, body").animate({scrollTop: $(".list.publishing ." + mainClickTxt).offset().top}, 100);
				$(activeTarget).removeClass("active");
			}
		});
	}
	function randerPPDetailDesign(target, ppType, info) {
		$.getJSON("js/pp_" + ppType + ".json", function(data) {
			var currData = Object.values(data[info.type].typeList)[info.num];
			$(target).find("dt").text("").text(currData.tit);
			$(target).find(".summary").text("").text(currData.summary);
			$(target).find(".rate").text("").text(currData.rate);
			$(target).find(".siteUrl a").attr("href", "").attr("href", currData.url).text("").text(currData.url);
			$(target).find(".txt").text("").text(currData.note);
			$(target).find(".imgBox").empty();
			if(!!currData.img) {
				currData.img.forEach(function(img) {
					$(target).find(".imgBox").append("<img src='images/" + img + "' alt='" + currData.tit + "' image'>");
				});
			}
		});
	}
}


/* 벽돌형식 포지셔닝 : align to masonry type */
function setMasonry(target) {
	masonry();
	$(window).on("resize", function() { masonry(); });
	function masonry() {
		$(target).each(function() {
			$(this).children().css("position", "static");
			var colNum = parseInt($(this).width()/$(this).children().width());
			var arrLeft = [], arrTop = [];
			var otherSpaceH = Math.ceil(parseInt($(this).css("paddingLeft"))/colNum);
			$(this).children().each(function(childIndex) {
				var thisH = $(this).outerHeight() + parseInt($(this).css("marginBottom")) + parseInt($(this).css("marginTop"));
				if(childIndex < colNum) {
					arrLeft.push($(this).position().left);
					arrTop.push(thisH);
					$(this).stop().animate({"top" : 0, "left" : arrLeft[childIndex]}, 0);
				} else {
					var minTop = Math.min.apply(Math, arrTop);
					var minIndex = arrTop.indexOf(minTop);
					$(this).stop().animate({"top" : minTop, "left" : arrLeft[minIndex]}, 0);
					arrTop[minIndex] = thisH + minTop + otherSpaceH;
				}
			});
			$(this).css({"position":"relative", "height": Math.max.apply(Math, arrTop) + parseInt($(this).css("paddingBottom"))}).children().css({"position":"absolute"});
		});
	}
}


/* 특정 브라우저, 모바일기기 구분 : set mobile specific browser */
function setMobileBrowser() {
	$("#wrap").addClass(chkMobile());
	var chkSamsung = chkMobileModel();
	var chkMSie = chkBrowserType();
	if(chkSamsung === "Samsung") $("#wrap").addClass(chkSamsung);
	if(chkMSie === "MSie") $("#wrap").addClass(chkMSie);
}


/* wrap태그 높이 윈도우 크기로 세팅 : set #wrap height to window height */
function setWrapH(stat) {
	if(stat) {
		$("#wrap").height($(window).height());
		$(window).on("resize", function() {
			$("#wrap").height($(window).height());
		});
	} else {
		$("#wrap").height("auto");
		$(window).off("resize");
	}
}


/* 컨텐츠요소 width와 동일 height로 세팅 : set squere by height with object width value */
function setSquare(target) {
	setHwithW(target);
	$(window).on("resize", function() { setHwithW(target); });
	function setHwithW(target) {
		$.each(arguments, function(index, targetVal) {
			var tempH = $(targetVal).width();
			if(targetVal.split(" ").length > 1 && !targetVal.split(" .").length > 1 && !targetVal.split(" #").length > 1) tempH = $(targetVal).eq(0).width();
			$(targetVal).height(tempH);
		});
	}
}


/********** check about navigator **********/
function chkMobileModel() {
	var arrMobileModel = new Array("iPhone", "iPod", "iPad", "Windows CE", "LG", "MOT", "Samsung", "Android", "BlackBerry", "SonyEricsson");
	for(var index in arrMobileModel){
	    if(navigator.userAgent.match(arrMobileModel[index]) != null){
			return arrMobileModel[index];
	    }
	}
}
function chkMobile() {
    var mobileFilter = "win16|win32|win64|mac";
    if(navigator.platform){
        if(0 > mobileFilter.indexOf(navigator.platform.toLowerCase())) return "Mobile";
        else return "PC";
    }
}
function chkBrowserType() {
    var browser = navigator.userAgent.toLowerCase();
    if(-1 != browser.indexOf("chrome")) return "Chrome";
    if(-1 != browser.indexOf("msie")) return "MSie";
	if(-1 != browser.indexOf("rv:11.0")) return "MSie";
	if(-1 != browser.indexOf("firefox")) return "Firefox";
    if(-1 != browser.indexOf("opera")) return "Opera";
}
