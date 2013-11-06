$(document).ready(function () {

    RegisterUserToken();

    var badBrowser = false;
    if ($.browser.opera) {
        badBrowser = true;
    }
    if ($.browser.webkit) {
        if ($.browser.version < 535.19) { badBrowser = true; }
    }
    if ($.browser.msie) {
        if ($.browser.version != 9.0) { badBrowser = true; }
    }
    if ($.browser.mozilla) {
        if ($.browser.version < 10.0) { badBrowser = true; }
    }
    if (navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('iPad') != -1 || navigator.userAgent.indexOf('Blackberry') != -1 || navigator.userAgent.indexOf('Android') != -1) {
        badBrowser = false;
    }
    var thumb = $.QueryString["thumbnail"];
    if (thumb) { badBrowser = false; }

    if (badBrowser) { displayBrowserBlock(); }
    /* This function sets up a tooltip for any element on the page with a title attribute */
    $("[title]").delay(1000).tooltip({
        tipClass: 'tooltip',
        predelay: 1000,
        delay: 0,
        cancelDefault: true,
        effect: 'slide',
        position: 'top center',
        offset: [-10, 0],
        events: { input: "mouseover,mouseout" }
    }).dynamic({ bottom: { direction: 'down', bounce: false} });


    $("._EKSC_nav>ul>li").hover(function () {

        setPromo(this);

    });


    /* This function perfroms the text blurring of other submenus when a submenu is hovered over */
    $("._EKSC_submenu>ul>li").hover(function () {
        $(this).siblings("li").children("ul").each(function (i, val) {
            $(val).addClass("_EKSC_blur_text").removeClass("_EKSC_clear_text");
        })
        $(this).children("ul").addClass("_EKSC_clear_text");


        //$("._EKSC_promo_spot").html($(this).attr("rel"));

        setPromo(this);

        //var currentPromo = $(this).children("._EKSC_promo").html();
        //if (currentPromo != null) {
        //    $(this).parents("._EKSC_submenu").find("._EKSC_promo_spot").html(currentPromo).show();
        //}
    });

    /* This function shows and hides the submenus based on a hover event */
    $("#_EKSC_primary_nav_navigation>ul>li._EKSC_list_menu").delay(1000).hover(
			function () {
			    $("._EKSC_submenu").hide(); /* Hide other menus that may be showing */
			    $("._EKSC_account_info").hide(); /* Hide login dropdown that may be showing */
			    $(this).children("._EKSC_submenu").show();
			},
			function () {
			    $(this).children("._EKSC_submenu").hide();
			})

    /* This function performs the show and hide for menu items that are forms */
    /* It ensures that the drop down does not hide if a form field still has focus */
    $("#_EKSC_primary_nav_navigation>ul>li._EKSC_form_menu").delay(1000).hover(
			function () {
			    $("._EKSC_submenu").hide(); /* Hide other menus that may be showing */
			    $("._EKSC_account_info").hide(); /* Hide login dropdown that may be showing */
			    $(this).children("._EKSC_submenu").show();
			},
			function () {
			    var stillFocus = $(this).find("input:focus, select:focus, option:focus, textarea:focus");
			    if (stillFocus.length != 0) {
			        return;
			    }
			    else {
			        $(this).children("._EKSC_submenu").hide();
			        $("#ui-datepicker-div").hide();
			    }
			})

    /* This function shows and hides the login dropdown */
    $("._EKSC_account").hover(
			function () {
			    $("._EKSC_submenu").hide(); /* hide all other submenus */
			    $(this).children("._EKSC_account_info").slideDown();
			},
			function () {
			    var stillFocus = $(this).find("input:focus, select:focus, option:focus, textarea:focus");
			    if (stillFocus.length != 0) {
			        return;
			    }
			    else {
			        var thisOne = $(this) + " ._EKSC_account_info";
			        $(this).children("._EKSC_account_info").hide();
			    }
			})
    /* This function shows the date selector when the date input field has focus */
    $("#datefield").focus(function () {
        $("#bookdate").show();
    })
    $("#datefield").blur(function () {
        $("#bookdate").hide();
    })
    /* This function sets up the tabs on the product details page */
    $("ul._EKSC_tabs").tabs("div._EKSC_panes>div",
                            { current: 'currentTab'}
                            );

    /* This function uses a web service to suggest city and states using autocomplete */
    $("#city").autocomplete({ appendTo: "#resultlist" }, { autoFocus: true }, {
        source: function (request, response) {
            $.ajax({
                url: "http://ws.geonames.org/searchJSON",
                dataType: "jsonp",
                data: {
                    featureClass: "P",
                    style: "full",
                    maxRows: 12,
                    country: "US", /* UK for the United Kingdom, AU for Australia. Visit www.davros.org/misc/iso3166.html for more codes */
                    name_startsWith: request.term
                },
                success: function (data) {
                    response($.map(data.geonames, function (item) {
                        return {
                            label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
                            value: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName
                        }
                    }));
                }
            });
        },

        minLength: 2,

        open: function () {
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function (event, ui) {
            event.preventDefault();
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
    });

    /* This script creates the grey background bar based on the height of the page divider */
    var top = $("._EKSC_divider").offset();
    $("#_EKSC_top").attr("style", "height: " + top.top + "px");

    setBar();

    /* Uses jQuery UI to show date picker on demo booking form */
    $("#datefield").datepicker({
        showButtonPanel: false
    });
});

/* this function copies promo output in node and applies it root */
function setPromo(item) {

    var rel = $(item).attr("rel");
    var html = $(item).find("#promo_" + rel).html();
    //alert(rel);
    if (typeof rel != "undefined" && html != null) {
        //$("._EKSC_promo_spot").css("display", "block");
        $("._EKSC_promo_spot").show();
        $("._EKSC_promo_spot").html(html);
    } else {
        //$("._EKSC_promo_spot").css("display","none");
        $("._EKSC_promo_spot").hide();
    }

}



/* This script creates the grey background bar based on the height of the page divider */
function setBar() {
    var top = $("._EKSC_divider").offset();
    $("#_EKSC_top").attr("style", "height: " + top.top + "px");
}

function lineUpMenus() {
	/* Thisfunction iterates through all submenus. For each menu it get the menu width to calculate */
	/* The center of the element to centrally place it under the menu item it drops down under */
	$("._EKSC_submenu").each(function (i, val) {
		var mwidth = $(val).width();
		var twidth = $(val).prevAll("._EKSC_menu_text").width();
		var shift = ((mwidth / 2) - mwidth + (twidth / 2));
		var leftshift = "left: " + shift + "px";
		$(val).attr("style", leftshift);
		var promo = "width: " + mwidth;
		$(val).children(" ._EKSC_promo_spot").attr("style", promo);
	})
}

function displayBrowserBlock() {
	$("body").after("<div id='badbrowser' style='display:none;width:300px; height:100px;'><p>We are sorry,&nbsp;but the browser you are using is not currently supported in this demo site, please use one of the following browsers:</p><ul><li><a href='http://windows.microsoft.com/en-US/internet-explorer/products/ie/home'>Internet Explorer, version 9</a></li><li><a href='http://www.mozilla.org/en-US/firefox/new/?from=getfirefox'>Mozilla Firefox, version 10 or higher</a></li><li><a href='https://www.google.com/chrome'>Chrome, version 18 or higher</a></li></ul><p class='alert'>Note for IE users. Make sure your compatibility view settings are disabled. Tools > Compatibility View Settings. Make sure all check boxes are NOT checked.</p></div>");
	$("#badbrowser").dialog({ title: "Unsupported Browser", resizable: false, modal: true, closeOnEscape: false, draggable: false, width: 500, close: function () { location.reload(); } });
	$(".ui-dialog-titlebar-close").hide();
	$("#badbrowser li a").attr("style", "text-decoration : underline");
};

function findStores(input, callback) {
	var locInfo = new locationInfo("address", input);
	locInfo.getLocationInfo(saveLocation);
	function saveLocation(success, nlat, nlng, ncity, nstate, nzip, naddress) {
		if (success) {
			locInfo.lat = nlat;
			locInfo.lng = nlng;
			locInfo.city = ncity;
			locInfo.state = nstate;
			locInfo.zip = nzip;
			locInfo.address = naddress;
		}
		else {
			locInfo.lat = "42.796";
			locInfo.lng = "-71.530";
			locInfo.city = "Nashua";
			locInfo.state = "NH";
			locInfo.zip = "03063";
			locInfo.address = naddress;
		}
		callback(locInfo);
	}
}
function displayLocation(location) {
	$("._EKSC_zip").text(location.zip);
	$(".addressa, select#store>option:nth-child(1)").text((location.getAddress("a")));
	$(".addressb, select#store>option:nth-child(2)").text((location.getAddress("b")));
	$(".addressc, select#store>option:nth-child(3)").text((location.getAddress("c")));
	lineUpMenus();
}
function locateStore(what) {
    var findWhat = $("#" + what).val();
    createCookie("findwhat", findWhat, 0);
    window.location = "/StoreLocator.aspx?findwhat=1";
}
function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
};

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
};

function eraseCookie(name) {
	createCookie(name, "", -1);
};
(function ($) {
	$.QueryString = (function (a) {
		if (a == "") return {};
		var b = {};
		for (var i = 0; i < a.length; ++i) {
			var p = a[i].split('=');
			if (p.length != 2) continue;
			b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		}
		return b;
	})(window.location.search.substr(1).split('&'))
})(jQuery);

function trim(s) {
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s;
}
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}


function RegisterUserToken(){

    var cookieVal = GetCookie("hubspotutk");
    var usertoken = $("#hsUTK");
    if (typeof usertoken != 'undefined') {
        usertoken.val(cookieVal);
    }

}

function GetCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg) {
            return getCookieVal(j);
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}

function getCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1) {
        endstr = document.cookie.length;
    }
    
    return unescape(document.cookie.substring(offset, endstr));
}

