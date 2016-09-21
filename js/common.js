/**
 * Created by Administrator on 2015/10/16.
 */

//浏览器检测
(function() {
    window.sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
    (s = ua.match(/rv:([\d.]+)/)) ? sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
    (s = ua.match(/opera\/.*version\/([\d.]+)/)) ? sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;

    if(/webkit/.test(ua)) sys.webkit = ua.match(/webkit\/([\d.]+)/)[1];
})();

//DOM加载
function addDomLoaded(fn){
    var isReady = false;
    var timer = null;
    function doReady(){
        if(timer) clearInterval(timer);
        if(isReady) return;
        isReady = true;
        fn();
    }

    if((sys.opera && sys.opera < 9) || (sys.firefox && sys.firefox < 3) || (sys.webkit && sys.webkit < 525)){
        //基本上用不着
        //这相当于主流浏览器的onloads事件
        //知识为了向下兼容
        timer = setInterval(function(){
            if(/loaded|completed/.test(document.readyState)){
                //loaded部分加载，completed完全加载完毕
                doReady();
            }
        },1)
    }else if(document.addEventListener){
        //W3C
        EventUtil.addEvent(document,'DOMContentLoaded',function(){
            fn();
            EventUtil.removeEvent(document,'DOMContentLoaded',arguments.callee);
        });
    }else if(sys.ie && sys.ie < 9){
        var timer = null;
        time = setInterval(function(){
            try{
                document.documentElement.doScrool('left');
                doReady();
            }catch(e){};
        });
    }
}


//事件管理器
var EventUtil={
    addEvent: function(element, type, handler){
        if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeEvent: function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },
    getEvent:function(event){
        return event ? event : window.event;
    },
    getTarget:function(event){
        return event.target || event.srcElement;
    },
    getRelatedTarget:function(event){
        if(event.relatedTarget){
            return event.relatedTarget;
        } else if(event.toElement){
            return event.toElement;
        } else if(event.fromElement){
            return event.fromElement;
        } else {
            return null;
        }
    },
    preventDefault:function(event){
        if(event.preventDefault){
            event.cancelable=true;
            event.preventDefault();
        } else {
            event.returnValue=false;
        }
    },
    stopPropagation:function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        } else {
            event.cancelBubble=true;
        }
    },
    getCharCode:function(event){
        return event.charCode||event.keyCode;
    },
    getWheelDelta: function(event) {
        if (event.wheelDelta) {
            return (sys.opera && sys.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
        } else {
            return -event.detail * 40;
        }
    }
};

//自定义事件管理器
function DefinedEvent(){
    this.handlers={};
}
DefinedEvent.prototype={
    constructor:DefinedEvent,
    addHandler:function(type,handler){
        if(typeof this.handlers[type]=="undefined"){
            this.handlers[type]=[];
        }
        this.handlers[type].push(handler);
    },

    fire:function(event){
        if(!event.target){
            event.target=this;
        }
        if(this.handlers[event.type] instanceof Array){
            var handlers=this.handlers[event.type];
            for(var i= 0,len=handlers.length;i<len;i++){
                handlers[i](event);
            }
        }
    },

    removeHandler:function(type,handler){
        if(this.handlers[type] instanceof Array){
            var handlers=this.handlers[type];
            for(var i= 0,len=handlers.length;i<len;i++){
                if(handler[i]==handler){
                    break;
                }
            }
            handlers.splice(i,1);
        }
    }
};

//寄生继承对象原型
function inheritPrototype(superObject,subObject){
    var prototype=superObject.prototype;
    prototype.constructor=subObject;
    subObject.prototype=prototype;
}

//自定义拖放事件操作
var DragDrop=function(element){
    var dragdrop=new DefinedEvent(),
        dragging=null,
        diffX= 0,
        diffY= 0;

    function handlerEvent(event){
        event=EventUtil.getEvent(event);
        var target=EventUtil.getTarget(event);

        switch(event.type){
            case "mousedown":
                if(element!==null&&target==element){
                    dragging=target;
                    diffX=event.clientX-target.offsetLeft;
                    diffY=event.clientY-target.offsetTop;
                }
                break;
            case "mousemove":
                if(dragging!==null){
                    dragging.style.left=event.clientX-diffX+"px";
                    dragging.style.top=event.clientY-diffY+"px";
                }
                break;
            case "mouseup":
                dragging=null;
                break;
        }
    }

    dragdrop.enable=function(){
        EventUtil.addHandler(document,"mousedown",handlerEvent);
        EventUtil.addHandler(document, "mousemove", handlerEvent);
        EventUtil.addHandler(document, "mouseup", handlerEvent);
    };
    dragdrop.disable = function(){
        EventUtil.removeHandler(document, "mousedown", handlerEvent);
        EventUtil.removeHandler(document, "mousemove", handlerEvent);
        EventUtil.removeHandler(document, "mouseup", handlerEvent);
    };

    return dragdrop;
};

//函数绑定
function bind(func,context){
    return function(){
        return func.apply(context,arguments);
    };
}

//函数节流 throttle
function throttle(func,context){
    clearTimeout(func.timeoutId);
    func.timeoutId=setTimeout(function(){
        func.call(context);
    },100);
}

//XMLHttpRequest对象
function createXMLHttpRequest(){
    if(typeof XMLHttpRequest != "undefined"){
        createXMLHttpRequest=function(){
            return new XMLHttpRequest();
        };
    } else if(typeof ActiveXObject !="undefined"){
        createXMLHttpRequest=function(){
            if (typeof arguments.callee.activeXString != "string"){
                try{return new ActiveXObject("MSXML2.XMLHttp.6.0");}
                catch(e){}
                try{return new ActiveXObject("MSXML2.XMLHttp.3.0");}
                catch(e){}
                try{return new ActiveXObject("MSXML2.XMLHttp");}
                catch(e){}
            }
        }
    } else {
        createXMLHttpRequest = function(){
            throw new Error("No XHR object available.");
        };
    }
    return createXMLHttpRequest();
}

//获取元素当前css样式，在外部样式表定义也可获取
function getStyle(element, attr){
    var value;
    if(typeof window.getComputedStyle != 'undefined'){
        //W3C
        if(parseFloat(window.getComputedStyle(element, null)[attr]) || parseFloat(window.getComputedStyle(element, null)[attr]) ==0){
            value = parseFloat(window.getComputedStyle(element, null)[attr]);
        }else{
            value = window.getComputedStyle(element, null)[attr]
    }
    }else if(typeof element.currentStyle != 'undefined' || parseFloat(window.getComputedStyle(element, null)[attr]) ==0){
        //IE
        if(parseFloat(element.currentStyle[attr])){
            value = parseFloat(element.currentStyle[attr]);
        }else{
            value = element.currentStyle[attr];
        }
    }
    return value;
}

//跨浏览器获取innerText
function getInnerText(element) {
    return (typeof element.textContent == 'string') ? element.textContent : element.innerText;
}

//跨浏览器设置innerText
function setInnerText(elememt, text) {
    if (typeof element.textContent == 'string') {
        element.textContent = text;
    } else {
        element.innerText = text;
    }
}

//获取窗口大小
function getClient(){
    if(document.compatMode == 'BackCompat'){
        return{
            width: document.body.clientWidth,
            height: document.body.clientHeight
        };
    }else if(document.compatMode == 'CSS1Compat'){
        return{
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };
    }
}

//获取文档大小
function getBigSize(){
    return{
        width: (document.documentElement.scrollWidth > document.documentElement.clientWidth)? document.documentElement.scrollWidth :document.documentElement.clientWidth,
        height: (document.documentElement.scrollHeight > document.documentElement.clientHeight)? document.documentElement.scrollHeight :document.documentElement.clientHeight
    }
}

//跨浏览器获取滚动条位置
function getScroll() {
    return {
        top : document.documentElement.scrollTop || document.body.scrollTop,
        left : document.documentElement.scrollLeft || document.body.scrollLeft
    }
}

//跨浏览器获取视口大小
function getInner() {
    if (typeof window.innerWidth != 'undefined') {
        return {
            width : window.innerWidth,
            height : window.innerHeight
        }
    } else {
        return {
            width : document.documentElement.clientWidth,
            height : document.documentElement.clientHeight
        }
    }
}


//获得窗口有关数据
function getViewport(){
    if(document.compatMode=="CSS1Compat"){
        return{
            clientWidth: document.body.clientWidth,
            clientHeight: document.body.clientHeight,
            scrollTop: document.body.scrollTop,
            scrollLeft: document.body.scrollLeft
        };
    } else {
        return{
            clientWidth: document.documentElement.clientWidth,
            clientHeight: document.documentElement.clientHeight,
            scrollTop: document.documentElement.scrollTop,
            scrollLeft: document.documentElement.scrollLeft
        };
    }
}


//获取元素相对于视口左边的距离
function offsetLeft(element){
    var offsetX=0;
    var offsetParent=element.offsetParent;
    while(offsetParent!==null){
        offsetX+=element.offsetLeft;
        element=element.offsetParent;
        offsetParent=element.offsetParent;
    }
    return offsetX;
}
function offsetTop(element){
    var offsetY=0;
    var offsetParent=element.offsetParent;
    while(offsetParent!==null){
        offsetY+=element.offsetTop;
        element=element.offsetParent;
        offsetParent=element.offsetParent;
    }
    return offsetY;
}

//动画
var  myAnimation=function(element,time,direction,position){
    var timeoutId=null;
    var elementPosition={
        left:element.offsetLeft,
        top:element.offsetTop
    };
    var currentDistance={
        left:elementPosition.left,
        top:elementPosition.top
    };
    var speed={
        vX:Math.ceil(Math.abs(position.X-elementPosition.left) / (time*10)),
        vY:Math.ceil(Math.abs(position.Y-elementPosition.top) / (time*10))
    };
    timeoutId=setTimeout(function fn(){
        if(direction=="up"){
            if(currentDistance.top>position.Y){
                element.style.top=currentDistance.top+"px";
                currentDistance.top-=speed.vY;
            } else {
                element.style.top=position.Y+"px";
                clearTimeout(timeoutId);
                return;
            }
        }
        if(direction=="down"){
            if(currentDistance.top<position.Y){
                element.style.top=currentDistance.top+"px";
                currentDistance.top+=speed.vY;
            }
            else {
                element.style.top=position.Y+"px";
                clearTimeout(timeoutId);
                return;
            }
        }
        if(direction=="left"){
            if(currentDistance.left>position.X){
                element.style.left=currentDistance.left+"px";
                currentDistance.left-=speed.vX;
            }
            else {
                element.style.left=position.X+"px";
                clearTimeout(timeoutId);
                return;
            }
        }
        if(direction=="right"){
            if(currentDistance.left<position.X){
                element.style.left=currentDistance.left+"px";
                currentDistance.left+=speed.vX;
            }
            else {
                element.style.left=position.X+"px";
                clearTimeout(timeoutId);
                return;
            }
        }
        timeoutId=setTimeout(fn,10);
    },100);
};