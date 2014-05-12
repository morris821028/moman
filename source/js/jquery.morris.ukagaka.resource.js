(function($) { // 封裝起來, 以免和外界js 變數衝突到
    $.fn.extend({
        //plugin name - animatemenu    // 定義 plugin 名稱
        ukagaka: function(options) {

            var talkValid = true;
            //Settings list and the default values   // 設定plugin input parameters 的預設值
            var defaults = {
                googleKey: '0ArRwmWo93u-mdG93a2dkSWxIbHEzZjRIeDdxZXdsU1E',
                googleFormkey: '1xADUIiBq1ksH7lxwSch1Nz_p2gSxdJttmv5OJOxJye0',
                googleSheet: "od6",
                googleSheetField: "entry.2030600456",
                talkTime: 30000
            };

            // 把預設值和實際輸入值比對, 如果有傳入值的則以傳入值為主
            // 如此便得到輸入值 options (在此匿名函式中存在之變數)
            var options = $.extend(defaults, options);
            // 執行此 plugin 的實際動作, 對其作用對象的陣列迭代(iterate over), 例如說對$(".class_name") 呼叫此plugin, 則 this.each 就代表所有帶有 class_name 為 class 屬性的DOM element
            return this.each(function() {
                var o = options;
                //Assign current element to variable, in this case is UL element
                var obj = $(this); // obj 代表迭代到的單一物件

                var key = o.googleKey;
                var sheet = o.googleSheet;
                var formkey = o.googleFormkey;
                var sheetfield = o.googleSheetField;

                var talking = [];

                var loadingText = "Sleep zZz";

                var innerSettingHTML = "";
                innerSettingHTML += "<div id='ukagaka_img'></div>";
                innerSettingHTML += "<div class='ukagaka_box'>";
                innerSettingHTML += "<div class='ukagaka_msg' id='ukagaka_msgbox'>" + loadingText + "</div>";
                innerSettingHTML += "<div class='ukagaka_msg' id='ukagaka_menubox' style='display:none'>使用選單功能&#65292;吾才不需要汝教。<br/><br/><span id='ukagaka_menu_btn_addstring'>$ 學習</span><span id='ukagaka_menu_btn_renewlist'>$ 日誌</span><span id='ukagaka_menu_btn_exit'>$ 結束</span></div>";
                innerSettingHTML += "<div class='ukagaka_msg' id='ukagaka_stringinput' style='display:none'>請輸入讓偽春菜學的句子<br/><br/><input id='ukagaka_addstring' type='text'/><span id='ukagaka_addmenu_add'>$ 增加</span><span id='ukagaka_btn_menu'>$ 取消</span></div>";
                innerSettingHTML += "<div class='ukagaka_msg' id='ukagaka_renewlist' style='display:none'>更新日誌<br/><br/>Morris 修正<br/><br/>找尋 AI 系統<br/>找尋 AI 對話<br/><br/><span id='ukagaka_btn_menu'>$ 取消</span></div>";
                innerSettingHTML += "<input id='ukagaka_sheetfield' type='hidden' value='" + sheetfield + "'>";
                innerSettingHTML += "</div>";

                var footerMenuHTML = "";
                footerMenuHTML += "<div id='ukagaka_controlpanel'>";
                footerMenuHTML += "<input id='ukagaka_usertalk'>";
                footerMenuHTML += "<span id='ukagaka_btn_showmenu' title='menu'></span>";
                footerMenuHTML += "<div id='ukagaka_menu_list'>";
                footerMenuHTML += "<span id='ukagaka_btn_menu' title='learn'></span>";
                footerMenuHTML += "<span id='ukagaka_btn_display' title='power'></span>";
                footerMenuHTML += "<span id='ukagaka_btn_mail' title='mail'></span>";
                footerMenuHTML += "<span id='ukagaka_btn_music' title='music'></span>";
                footerMenuHTML += "<span id='ukagaka_btn_up' title='gotop'></span>";
                footerMenuHTML += "<span id='ukagaka_btn_down' title='godown'></span>";
                footerMenuHTML += "</div>";
                footerMenuHTML += "</div>";

                obj.append(innerSettingHTML);
                obj.after(footerMenuHTML);

                /* $.ajax({
                    type: 'GET',
                    url: 'http://localhost:8080',
                    data: sendData,
                    success: function(JData){
                        var NumOfJData = JData.length;
                        console.log(JData);
                    }
                });*/

                function reloadtalking() {
                    /* JSON / load string from database */
                    $.getJSON("https://spreadsheets.google.com/feeds/list/" + key + "/" + sheet + "/public/values?alt=json", function(JData) {
                        for (var i = 0; i < JData.feed.entry.length; i++) {
                            talking[i] = JData.feed.entry[i].gsx$storedatabase.$t;
                            // console.log("talk stmt : " + talking[i]);
                        }
                        $('input#ukagaka_addstring').attr('placeholder', '目前春菜學會了' + JData.feed.entry.length + '個字彙');
                    });
                };
                $("#ukagaka_usertalk").hide();
                if (navigator.userAgent.match(/Android|iPhone|iPad/i)) {
                    $("#ukagaka_img").hide();
                    $(".ukagaka_box").hide();
                } else {
                    $(window).load(function() {
                        var talk_timer = setInterval(talkingbox, o.talkTime);

                        function talkingbox() {
                            if ($("#ukagaka_msgbox").css("display") != 'none' && talkValid == true) {
                                $("#ukagaka_msgbox").fadeOut(500, function() {
                                    $(this).html(talking[Math.floor(Math.random() * talking.length)]).fadeIn(500)
                                });
                            }
                        }
                    });
                    reloadtalking();
                    obj.draggable();
                    // $(".ukagaka_box").hide();
                }

                $(window).scroll(function() {
                    if ($(this).scrollTop() > 1800 && talkValid == true) {
                        $("#ukagaka_msgbox").html($("#toc").html());
                        talkValid = false;
                    } else {
                        talkValid = true;
                    }
                });
                $("#ukagaka_menu_list").hide();

                $("#ukagaka_usertalk").keypress(function(e) {
                    code = (e.keyCode ? e.keyCode : e.which);
                    if (code == 13) {
                        var sendData = {};
                        sendData['msg'] = $("#ukagaka_usertalk").val();
                        $("#ukagaka_usertalk").val("");
                        $.ajax({
                            type: 'GET',
                            url: 'http://140.115.205.194:8080',
                            data: sendData,
                            success: function(JData) {
                                $("#ukagaka_msgbox").fadeOut(500, function() {
                                    $(this).html(JData).fadeIn(1000);
                                    if (Math.random() < 0.1028) {
                                        var imgIndex = Math.floor(Math.random() * 8);
                                        $('#ukagaka_img').css({
                                            'background': 'url(/img/ukagaka_img' + imgIndex + '.png) no-repeat'
                                        });
                                    }
                                });
                            },
                            error: function(argument) {
                                $("#ukagaka_msgbox").fadeOut(500, function() {
                                    $(this).html("主機關閉中 ...").fadeIn(1000);
                                });
                            }
                        });
                    }
                });
                $(document).on('click', "#ukagaka_btn_mail", function(event) {
                    $("#ukagaka_usertalk").toggle('slide', null, 500)
                    $("#ukagaka_menu_list").toggle('slide', null, 500);
                });
                $(document).on('click', "#ukagaka_btn_up", function(event) {
                    $("html,body").animate({
                        scrollTop: 0
                    }, 1000);

                    $("#ukagaka_menu_list").toggle('slide', null, 500);
                });
                $(document).on('click', "#ukagaka_btn_down", function(event) {
                    $("html,body").animate({
                        scrollTop: document.body.scrollHeight
                    }, 1000);

                    $("#ukagaka_menu_list").toggle('slide', null, 500);
                });
                $(document).on('click', "#ukagaka_btn_showmenu", function(event) {
                    var hideElem = $('#ukagaka_menu_list');
                    hideElem.toggle('slide', null, 500);
                });
                $(document).on('click', "#ukagaka_btn_display", function(event) {
                    var hideElem = $('.ukagaka_box');
                    if (hideElem.css("display") == 'none') {
                        $('#ukagaka_img').css({
                            'background': 'url(/img/ukagaka_img0.png) no-repeat',
                            'width': '300px',
                            'height': '230px'
                        });
                        $('#ukagaka_panel').css({
                            'width': '300px',
                            'height': '230px'
                        });
                        $(".ukagaka_box").show();
                    } else {
                        $('#ukagaka_img').css({
                            'background': 'url(/img/ukagaka_sleep.png) no-repeat',
                            'width': '128px',
                            'height': '72px'
                        });
                        $('#ukagaka_panel').css({
                            'width': '128px',
                            'height': '72px'
                        });
                        $(".ukagaka_box").hide();
                    }
                });
                $(document).on('click', "#ukagaka_menu_btn_exit", function(event) {
                    $(".ukagaka_box div").fadeOut(500);
                    $("#ukagaka_msgbox").delay(500).fadeIn(500);
                    $('#ukagaka_img').css({
                        'background': 'url(/img/ukagaka_img0.png) no-repeat'
                    });
                });
                $(document).on('click', "#ukagaka_btn_menu", function(event) {
                    $(".ukagaka_box div").fadeOut(500);
                    $("#ukagaka_menubox").delay(500).fadeIn(500);
                    $('#ukagaka_img').css({
                        'background': 'url(/img/ukagaka_img5.png) no-repeat'
                    });
                });
                $(document).on('click', "#ukagaka_menu_btn_addstring", function(event) {
                    $(".ukagaka_box div").fadeOut(500);
                    $("#ukagaka_stringinput").delay(500).fadeIn(500);
                });
                $(document).on('click', "#ukagaka_menu_btn_renewlist", function(event) {
                    $(".ukagaka_box div").fadeOut(500);
                    $("#ukagaka_renewlist").delay(500).fadeIn(500);
                });
                $(document).on('click', "#ukagaka_addmenu_add", function(event) {
                    var add = $("input#ukagaka_addstring").val();
                    var googleSheetField = $('input#ukagaka_sheetfield').val();
                    var sendData = {};
                    sendData[googleSheetField] = add;
                    if (!((add.length <= 1) || add.indexOf('script') > -1 || add.indexOf('body') > -1 ||
                        add.indexOf('style') > -1 || add.indexOf('link') > -1 || add.indexOf('iframe') > -1 || add.indexOf('head') > -1 ||
                        add.indexOf('nav') > -1 || add.indexOf('object') > -1 || add.indexOf('embed') > -1)) {
                        $.ajax({
                            type: 'POST',
                            url: 'https://docs.google.com/forms/d/' + formkey + '/formResponse',
                            data: sendData,
                            dataType: "xml",
                            statusCode: {
                                0: function() {
                                    $("input#ukagaka_addstring").attr("value", "");
                                    $(".ukagaka_box div").fadeOut(500);
                                    $("#ukagaka_msgbox").fadeOut(500, function() {
                                        $(this).html("偽春菜學習了 !").fadeIn(1000)
                                    });
                                },
                                200: function() {
                                    $("input#ukagaka_addstring").attr("value", "");
                                    $(".ukagaka_box div").fadeOut(500);
                                    $("#ukagaka_msgbox").fadeOut(500, function() {
                                        $(this).html("偽春菜學習了 !").fadeIn(1000)
                                    });
                                }
                            }
                        });
                    } else {
                        alert("OOPS！偽春菜不接受這個字串喔！");
                    }
                });

            });
        }
    });
})(jQuery);