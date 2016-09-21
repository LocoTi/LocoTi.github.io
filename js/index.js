/**
 * Created by Administrator on 2015/11/16.
 */
$(function(){
    var containerHeight =  $("#main_container").css('height');
    container_center();

    var preIndex = 0, index = 0;
    var length;
    var delta;

    function handlerKeypress(e){
        EventUtil.removeEvent(document, 'keydown', handlerKeypress);
        function handler(){
            var charCode;

            e = EventUtil.getEvent(e);
            charCode = EventUtil.getCharCode(e);
            length = $("#content li").elements.length;

            for(var i = 0;i<length;i++){
                if($("#content li").eq(i).attr('class') == 'active_li'){
                    preIndex = i;
                }
            }
            if(charCode == 39 || charCode == 37){
                e.code = charCode;
                aside_animate(e);
                //initEvent($("#content li").get(preIndex - 1));
            } else if(charCode == 38 || charCode == 40){
                e.code = charCode;
                li_animate(e);
                //initEvent($("#content li").get(preIndex - 1));
            }
        }

        setTimeout(handler, 200);
    }

    function handlerMouseWheel(e){
        eventOff();
        function handler(){

            e = EventUtil.getEvent(e);
            delta = EventUtil.getWheelDelta(e);

            length = $("#content li").elements.length;
            for(var i = 0;i<length;i++){
                if($("#content li").eq(i).attr('class') == 'active_li'){
                    preIndex = i;
                }
            }

            if(delta > 0){
                if(preIndex != 0){
                    e.preIdex = preIndex;
                    e.delta = delta;
                    li_animate(e);
                    //initEvent($("#content li").get(preIndex - 1));
                }
            }else if(delta < 0){
                if(preIndex != length - 1){
                    e.preIdex = preIndex;
                    e.delta = delta;
                    li_animate(e);
                    //initEvent($("#content li").get(preIndex + 1));
                }
            }
        }

        setTimeout(handler, 200);
    }

    var eventBind = function(){
        EventUtil.addEvent(document, 'keydown', handlerKeypress);

        EventUtil.addEvent(document, 'mousewheel', handlerMouseWheel);
        EventUtil.addEvent(document, 'DOMMouseScroll', handlerMouseWheel);
    };
    var eventOff = function(){
        EventUtil.removeEvent(document, 'keydown', handlerKeypress);

        EventUtil.removeEvent(document, 'mousewheel', handlerMouseWheel);
        EventUtil.removeEvent(document, 'DOMMouseScroll', handlerMouseWheel);
    };

    eventBind();

    //$("#web_lead").css('display', 'block').animate({
    //    attr: 'opacity',
    //    target: 100,
    //    t: 10,
    //    fn: function(){
    //        setTimeout(function(){
    //            $("#web_lead").animate({
    //                attr: 'opacity',
    //                target: 0,
    //                t: 50,
    //                fn: function(){
    //                    $("#web_lead").css('display', 'none');
    //                }
    //            })
    //        }, 1500);
    //    }
    //});

    (function(){
        var tipShow, tipHide;
        $(".kill_bg").bind('mouseenter', tipShow = function(){
            $(".kill_bg").off('mouseenter', tipShow);
            $(".kill_bg").off('mouseleave', tipHide);
            var that = this;

            setTimeout(function(){
                if($(that).find(".tip").elements.length > 0){
                    $(that).find(".tip").css('display', 'block');
                }
                $(".kill_bg").bind('mouseenter', tipShow);
                $(".kill_bg").bind('mouseleave', tipHide);
            }, 100)

        });
        $(".kill_bg").bind('mouseleave',tipHide = function(){
            $(".kill_bg").off('mouseenter', tipShow);
            $(".tip").css('display', 'none');
            setTimeout(function(){
                $(".kill_bg").bind('mouseenter', tipShow);
            }, 0)
        });
    })();

    function aside_animate(e){
        if(e.type == 'keydown' && typeof e.code != 'undefined'){
            if(e.code == 37){
                if( $("#aside").css('display') == 'block'){
                    $("#aside").animate({
                        attr: 'x',
                        target: -280,
                        type: 1,
                        fn: function(){
                            $("#aside_btn img").attr('src','icon/aside_hide.gif');
                            $("#aside").hide();
                            container_center();
                            eventBind();
                        }
                    });
                    $("#container").animate({
                        attr: 'x',
                        target: 0,
                        type: 1
                    });
                }
            }else if(e.code == 39){
                if($("#aside").css('display') == 'none'){
                    $("#aside").show().animate({
                        attr: 'x',
                        target: 0,
                        type: 1,
                        fn: function(){
                            $("#aside_btn img").attr('src','icon/aside_show.gif');
                            container_center();
                            eventBind();
                        }
                    });
                    $("#container").animate({
                        attr: 'x',
                        target: 280,
                        type: 1
                    });
                }
            }

        }else if(e.type == 'click' && typeof e.direction != 'undefined'){
            if(e.direction == 'left'){
                if( $("#aside").css('display') == 'block'){
                    $("#aside").animate({
                        attr: 'x',
                        target: -280,
                        type: 1,
                        fn: function(){
                            $("#aside_btn img").attr('src','icon/aside_hide.gif');
                            $("#aside").hide();
                            container_center();
                            eventBind();
                        }
                    });
                    $("#container").animate({
                        attr: 'x',
                        target: 0,
                        type: 1
                    });
                }
            }else if(e.direction == 'right'){
                if($("#aside").css('display') == 'none'){
                    $("#aside").show().animate({
                        attr: 'x',
                        target: 0,
                        type: 1,
                        fn: function(){
                            $("#aside_btn img").attr('src','icon/aside_show.gif');
                            container_center();
                            eventBind();
                        }
                    });
                    $("#container").animate({
                        attr: 'x',
                        target: 280,
                        type: 1
                    });
                }
            }
        }else if(e.type = 'click'){
            if( $("#aside").css('display') == 'block'){
                $("#aside").animate({
                    attr: 'x',
                    target: -280,
                    type: 1,
                    fn: function(){
                        $("#aside_btn img").attr('src','icon/aside_hide.gif');
                        $("#aside").hide();
                        container_center();
                        eventBind();
                    }
                });
                $("#container").animate({
                    attr: 'x',
                    target: 0,
                    type: 1
                });
            }else if($("#aside").css('display') == 'none'){
                $("#aside").show().animate({
                    attr: 'x',
                    target: 0,
                    type: 1,
                    fn: function(){
                        $("#aside_btn img").attr('src','icon/aside_show.gif');
                        container_center();
                        eventBind();
                    }
                });
                $("#container").animate({
                    attr: 'x',
                    target: 280,
                    type: 1
                });
            }
        }

    }

    function container_animate(e){
        length =  $("#main_container").find(".container").elements.length;

        for(i = 0;i<length;i++){
            if(preIndex != i && i != index){
                $("#main_container").find(".container").eq(i).hide();
                $("#main_container").find(".container").eq(i).css('top', -containerHeight + 'px');
            }
        }
        $("#main_container").find(".container").eq(index).show();

        if(index < preIndex){
            $("#main_container").find(".container").eq(index).show();
            $("#main_container").find(".container").eq(index).css('z-index',1);
            $("#main_container").find(".container").eq(index).siblings().css('z-index',0);
            $("#main_container").find(".container").eq(index).animate({
                attr: 'y',
                target: 0,
                speed: 10,
                t: 20,
                type: 1,
                fn: function(){
                    $("#main_container").find(".container").eq(index).show();
                    $("#main_container").find(".container").eq(index).siblings().hide();
                    $("#main_container").find(".container").eq(preIndex).css('top', -containerHeight + 'px');
                    $("#main_container").find(".container").eq(preIndex).css('z-index',0);

                    setTimeout(function(){
                        $("#content li").bind('click', li_animate);
                        $(".iconfont").bind('click', direction_click);
                        eventBind();
                    }, 500)
                }
            });
        }else if(index > preIndex){
            $("#main_container").find(".container").eq(preIndex).css('z-index',1);
            $("#main_container").find(".container").eq(index).css('top', 0);
            $("#main_container").find(".container").eq(preIndex).animate({
                attr: 'y',
                target: -containerHeight,
                step: 10,
                t: 10,
                fn: function(){
                    $("#main_container").find(".container").eq(index).show();
                    $("#main_container").find(".container").eq(index).siblings().hide();
                    $("#main_container").find(".container").eq(index).css('z-index',1);
                    $("#main_container").find(".container").eq(index).siblings().css('z-index',0);
                    //$("#main_container").find(".container").eq(preIndex).css('z-index',0);

                    setTimeout(function(){
                        $("#content li").bind('click', li_animate);
                        $(".iconfont").bind('click', direction_click);
                        eventBind();
                    }, 500)
                }
            });
        }
        $("#content").find("li").eq(index).siblings().removeClass('active_li');
        $("#content").find("li").eq(index).addClass('active_li');
    }

    function li_animate(e){
        e = EventUtil.getEvent(e);
        eventOff();
        $("#content li").off('click', li_animate);
        $(".iconfont").off('click', direction_click);

        if(e.type == 'keydown' && typeof e.code != 'undefined'){
            if(e.code == 38){
                if(preIndex !=0){
                    index = preIndex - 1;
                    container_animate(e);
                }
            }else if(e.code == 40){
                if(preIndex != length -1){
                    index = preIndex + 1;
                    container_animate(e);
                }
            }
        }else  if((e.type == 'mousewheel' || e.type == 'wheel') && typeof e.delta != 'undefined'){
            if(e.delta > 0){
                if(preIndex !=0){
                    index = preIndex - 1;
                    container_animate(e);
                }
            }else if(e.delta < 0){
                if(preIndex != length -1){
                    index = preIndex + 1;
                    container_animate(e);
                }
            }

        }else if(e.type == 'click' && typeof e.direction !='undefined'){
            if(e.direction == 'up'){
                if(preIndex !=0){
                    index = preIndex - 1;
                    container_animate(e);
                }
            }else if(e.direction == 'down'){
                if(preIndex != length -1){
                    index = preIndex + 1;
                    container_animate(e);
                }
            }
        }else if(e.type == 'click'){
            for(var i = 0;i<length;i++){
                if($("#content li").eq(i).attr('class') == 'active_li'){
                    preIndex = i;
                }
            }
            index = $(this).index();
            container_animate(e);
        }
    }

    function direction_click(e){
        e = EventUtil.getEvent(e);
        if($(this).attr('direction') == 'left'){
            e.direction = 'left';
            aside_animate(e);
        }else if($(this).attr('direction') == 'right'){
            e.direction = 'right';
            aside_animate(e);
        }else if($(this).attr('direction') == 'up'){
            for(var i = 0;i<length;i++){
                if($("#content li").eq(i).attr('class') == 'active_li'){
                    preIndex = i;
                }
            }
            e.direction = 'up';
            li_animate(e);
        }else if($(this).attr('direction') == 'down'){
            for(var i = 0;i<length;i++){
                if($("#content li").eq(i).attr('class') == 'active_li'){
                    preIndex = i;
                }
            }
            e.direction = 'down';
            li_animate(e);
        }
    }

    $("#my_blog").bind('click', function(){
        window.location.href = 'http://139.129.132.144/LocoTi/';
    });

    $(".iconfont").bind('click', direction_click);

    $("#content li").bind('click', li_animate);

    $("#aside_btn img").bind('click', aside_animate);

    $("#weibo").bind('click', function(){
        window.location.href = 'http://weibo.com/619949012';
    });

    $("#github").bind('click', function(){
        window.location.href = 'https://github.com/LocoTi/LocoTi.github.io';
    });

    (function(){
        var drag_length = $(".con_information").elements.length;
        var old_ifo_width = $(".con_information").elements[0].offsetWidth;
        var new_ifo_width = old_ifo_width;

        for(var i = 0; i<drag_length; i++){
            new_ifo_width = old_ifo_width +$(".con_information").eq(i).find('span').get(0).offsetWidth;
            $(".con_information").eq(i).css('width', new_ifo_width + 'px');
            $(".con_information").eq(i).drag({
                target: $(".con_information").eq(i).find('.iconfont_ifo').get(0),
                container: $("#main_container").first()
            });
        }
    })();

    //$(".con_information").bind('mousedown', function(){
    //    $(this).drag({
    //        target: $(this).find(".iconfont_ifo").first(),
    //        container: $("#main_container").first()
    //    })
    //})
});

function initEvent(obj){
    var event;
    if(document.createEvent){
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, 0, false, false, false, false, 0, null);

        obj.dispatchEvent(event);
    }
}

function container_center(){
    var timer = null;
    function center(){
        clearTimeout(timer);

        var containerWidth;
        var containerHeight;
        var containerLeft;

        containerWidth = getClient().width;
        containerLeft = $("#container").get(0).offsetLeft;
        containerWidth = containerWidth - containerLeft;

        if(containerWidth >= 400){
            $("#container").css('width', containerWidth + 'px');
        }

        containerHeight =  $("#container").css('height') - offsetTop($("#main_container").first());
        $("#main_container").css('height', containerHeight + 'px');

        timer = setTimeout(center,10)
    }
    timer = setTimeout(center,10);
}