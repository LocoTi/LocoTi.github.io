var $ = function(_this){
	return new Base(_this);
}

function Base(args){
	this.elements = [];

	if(args != undefined){
		if(typeof args == 'string'){
			var reg = new RegExp('\\s+');
			//CSS模拟
			if(args.indexOf(' ')){
				var elements = args.split(reg);
				var childElements = [];
				var node = [];
				for(var i = 0;i<elements.length;i++){
					if(node.length == 0) node.push(document);
					switch(elements[i].charAt(0)){
						case '#':
							childElements = [];                //清理临时范围作用父节点
							childElements.push(this.getId(elements[i].substring(1)));
							node = childElements;
							break;
						case '.':
							childElements = [];
							for(var j = 0;j<node.length;j++){
								var temps = this.getClass(elements[i].substring(1),node[j]);
								for(var k = 0;k<temps.length;k++){
									childElements.push(temps[k]);
								}
							}
							node = childElements;
							break;
						default:
							childElements = [];
							for(var j = 0;j<node.length;j++){
								var temps = this.getTagName(elements[i],node[j]);
								for(var k = 0;k<temps.length;k++){
									childElements.push(temps[k]);
								}
							}
							node = childElements;
							break;
					}
				}
				this.elements = childElements;
			}else{
				switch(args.charAt(0)){
					case '#':
						this.elements.push(this.getId(args.substring(1)));
						break;
					case '.':
						this.elements = this.getClass(args.substring(1));
						break;
					default:
						this.elements = this.getTagName(args);
						break;
				}
			}
		}else if(typeof args == 'object'){
			this.elements[0] = args;
		}else if(typeof args == 'function'){
			this.ready(args);
		}
	}

}

//addDomLoaded
Base.prototype.ready = function(fn){
	addDomLoaded(fn);
}

//实现连缀功能要返回Base对象
//获取ID
Base.prototype.getId = function(id){
	return document.getElementById(id);
}

//获取tag标签
Base.prototype.getTagName = function(tag, parentNode){
	var node = null;
	var temps = [];
	if(parentNode != undefined){
		node = parentNode;
	}else{
		node = document;
	}
	var tags = node.getElementsByTagName(tag);
	for(var i = 0;i < tags.length;i++){
		temps.push(tags[i]);
	}
	return temps;
}

//获取className,可以根据某个id元素内的className节点
Base.prototype.getClass = function(className,parentNode){
	var node = null;
	var temps = [];
	if(parentNode != undefined){
		node = parentNode;
	}else{
		node = document;
	}
	var all = node.getElementsByTagName('*');
	for(var i = 0;i<all.length;i++){
		if(all[i].className == className){
			temps.push(all[i]);
		}
	}
	return temps;
}

//设置CSS选择器
Base.prototype.find = function(str){
	var childElements = [];
	for(var i = 0;i < this.elements.length;i++){
		switch(str.charAt(0)){
			case '#':
				childElements.push(this.getId(str.substring(1)));
				break;
			case '.':
				var temps =this.getClass(str.substring(1), this.elements[i]);
				for(var j = 0;j<temps.length;j++){
					childElements.push(temps[j])
				}
				break;
			default:
				var temps =this.getTagName(str, this.elements[i]);
				for(var j = 0;j<temps.length;j++){
					childElements.push(temps[j])
				}
				break;
		}
	}
	this.elements = childElements;
	return this;
}

//获取某一个节点
Base.prototype.get = function(num){
	return this.elements[num];
}

//获取节点并返回Base对象
Base.prototype.eq = function(num){
	var element = this.elements;
	this.elements = [];
	this.elements[0] = element[num];
	return this;
}

//获取首个节点
Base.prototype.first = function(){
	return this.elements[0];
}

//获取最后一个节点
Base.prototype.last = function(){
	return this.elements[this.elements.length -1];
}

//获取某组节点的数量
Base.prototype.length = function () {
	return this.elements.length;
};

//获取所有兄弟节点
Base.prototype.siblings = function () {
    var element = this.elements[0];
    var elements =element.parentNode.children;
    for (var i = 0; i < elements.length; i ++) {
        if (elements[i].nodeType == 1 && elements[i] != element){
            if(element == this.elements[0]){
                this.elements[0] = elements[i];
            }else {
                this.elements.push(elements[i]);
            }
        }
    }
    return this;
};

//获取当前节点的下一个元素节点
Base.prototype.next = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i] = this.elements[i].nextSibling;
		if (this.elements[i] == null) throw new Error('找不到下一个同级元素节点！');
		if (this.elements[i].nodeType == 3) this.next();
	}
	return this;
};

//获取当前节点的上一个元素节点
Base.prototype.prev = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i] = this.elements[i].previousSibling;
		if (this.elements[i] == null) throw new Error('找不到上一个同级元素节点！');
		if (this.elements[i].nodeType == 3) this.prev();
	}
	return this;
};

//获取父节点
Base.prototype.parent = function () {
    var element;
    for (var i = 0, len = this.elements.length; i < len; i ++) {
        if(this.elements[i].parentNode != null){
            element =this.elements[i].parentNode
        }
        if (element.nodeType == 1){
            if(i == 0){
                this.elements[0] = element;
            }else {
                this.elements.push(element);
            }
        }
    }
    return this;
};


//设置或获取css样式
Base.prototype.css = function(attr, value){
	for(var i = 0;i < this.elements.length;i++){
		if(arguments.length == 1){
			return getStyle(this.elements[i], attr);
		}
		this.elements[i].style[attr] = value;
	}
	return this;
}

//获取某一个节点的属性
Base.prototype.attr = function (attr, value) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (arguments.length == 1) {
			return this.elements[i].getAttribute(attr);
		} else if (arguments.length == 2) {
			this.elements[i].setAttribute(attr, value);
		}
	}
	return this;
};


//获取某一个节点在整个节点组中是第几个索引
Base.prototype.index = function () {
	var children = this.elements[0].parentNode.children;
	for (var i = 0; i < children.length; i ++) {
		if (this.elements[0] == children[i]) return i;
	}
};

//设置某一个节点的透明度
Base.prototype.opacity = function (num) {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].style.opacity = num / 100;
		this.elements[i].style.filter = 'alpha(opacity=' + num + ')';
	}
	return this;
};


//添加class
Base.prototype.addClass = function(className){
	for(var i = 0;i<this.elements.length;i++){
		if(!this.elements[i].className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))){
			if(this.elements[i].className == ''){
				this.elements[i].className = className;
			}else{
				this.elements[i].className +=' ' + className;
			}
		}
	}
	return this;
}

//移除class
Base.prototype.removeClass = function(className){
	var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
	for(var i = 0;i<this.elements.length;i++){
		if(this.elements[i].className.match(reg)){
			this.elements[i].className = this.elements[i].className.replace(reg, '');
		}
	}
	return this;
}

//添加style规则
Base.prototype.addRule = function(num, selectorText, cssText, position){
	var sheet = document.styleSheets[num];
	if(typeof sheet.insertRule != 'undefined'){
		//W3C
		sheet.insertRule(selectorText+ '{' + cssText + '}', position);
	}else if(typeof sheet.addRule != 'undefined'){
		//IE
		sheet.addRule(selectorText, cssText, position);
	}
	return this;
}

//移除style规则
Base.prototype.removeRule = function(num, index){
	var sheet = document.styleSheets[num];
	if(typeof sheet.deleteRule != 'undefined'){
		//W3C
		sheet.deleteRule(index);
	}else if(typeof sheet.removeRule != 'undefined'){
		//IE
		sheet.removeRule(index);
	}
	return this;
}

//设置或获取元素内容
Base.prototype.html = function(str){
	for(var i = 0;i < this.elements.length;i++){
		if(arguments.length == 0){
			return this.elements[i].innerHTML;
		}
		this.elements[i].innerHTML = str;
	}
	return this;
}

//设置表单字段元素
Base.prototype.form = function (name) {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i] = this.elements[i][name];
	}
	return this;
};

//设置表单字段内容获取
Base.prototype.value = function (str) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (arguments.length == 0) {
			return this.elements[i].value;
		}
		this.elements[i].value = str;
	}
	return this;
}

//设置innerText
Base.prototype.text = function (str) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (arguments.length == 0) {
			return getInnerText(this.elements[i]);
		}
		setInnerText(this.elements[i], text);
	}
	return this;
}

//设置鼠标移入移出方法
Base.prototype.hover = function(over, out){
	for(var i = 0;i<this.elements.length;i++){
		this.elements[i].onmouseover = over;
		this.elements[i].onmouseout = out;
	}
	return this;
}

//切换方法
Base.prototype.toggle = function(){
	var _this = this;
	for(var i = 0;i<this.elements.length;i++){
		(function(element, args){
			var count = 0;
			_this.addEvent(element, 'click', function(){
				args[count++ % args.length].call(this);
			})
		})(this.elements[i], arguments);
	}
}

//设置显示
Base.prototype.show = function(){
	for(var i = 0;i<this.elements.length;i++){
		this.elements[i].style.display = 'block';
	}
	return this;
}

//设置隐藏
Base.prototype.hide = function(){
	for(var i = 0;i<this.elements.length;i++){
		this.elements[i].style.display = 'none';
	}
	return this;
}

//设置元素居中
Base.prototype.center = function(width, height){
	var top =(this.getClient().height - height) / 2 + getScroll().top;
	var left =(this.getClient().width - width) / 2 + getScroll().left;

	if(left <= getScroll().left){
		left = getScroll().left;
	}

	if(top <= getScroll().top){
		top = getScroll().top;
	}
	for(var i = 0;i<this.elements.length;i++){
		this.elements[i].style.top = top + 'px';
		this.elements[i].style.left = left + 'px';
	}
	return this;
}

//锁屏功能
Base.prototype.lock = function(){
	var _this = this;
	for(var i = 0;i<this.elements.length;i++){
		this.elements[i].style.width = this.getBigSize().width + 'px';
		this.elements[i].style.height = this.getBigSize().height + 'px';
		this.elements[i].style.display = 'block';
	}

	return this;
}

//定义click事件
Base.prototype.click = function(fn){
	for(var i = 0;i < this.elements.length;i++){
		this.elements[i].onclick = fn;
	}
	return this;
}

//浏览器滚动事件
Base.prototype.scroll = function(fn){
	for(var i = 0;i < this.elements.length;i++){
		var _this = this;
		var element = this.elements[i];
		_this.addEvent(window, 'scroll', function(){
			fn();
			var clientWidth = _this.getClient().width + getScroll().left;
			var clientHeight = _this.getClient().height + getScroll().top;

			if(element.offsetLeft < getScroll().left){
				element.style.left = getScroll().left + 'px';
			}else if(element.offsetLeft > clientWidth - element.offsetWidth){
				element.style.left = clientWidth - element.offsetWidth + 'px';
			}

			if(element.offsetTop < getScroll().top){
				element.style.top = getScroll().top + 'px';
			}else if(element.offsetTop > clientHeight - element.offsetHeight){
				element.style.top = clientHeight - element.offsetHeight + 'px';
			}

			if(element.offsetLeft < getScroll().left){
				element.style.left = getScroll().left + 'px';
			}
			if(element.offsetTop < getScroll().top){
				element.style.top = getScroll().top + 'px';
			}

		});
	}
	return this;
}

//触发浏览器窗口事件
Base.prototype.resize = function(fn){
	for(var i = 0;i < this.elements.length;i++){
		var _this = this;
		var element = this.elements[i];
		_this.addEvent(window, 'resize', function(){
			fn();
			var clientWidth = _this.getClient().width + getScroll().left;
			var clientHeight = _this.getClient().height + getScroll().top;

			if(element.offsetLeft <= getScroll().left){
				element.style.left = getScroll().left + 'px';
			}else if(element.offsetLeft > clientWidth - element.offsetWidth){
				element.style.left = clientWidth - element.offsetWidth + 'px';
			}

			if(element.offsetTop <= getScroll().top){
				element.style.top = getScroll().top + 'px';
			}else if(element.offsetTop > clientHeight - element.offsetHeight){
				element.style.top = clientHeight - element.offsetHeight + 'px';
			}

			if(element.offsetLeft <= getScroll().left){
				element.style.left = getScroll().left + 'px';
			}
			if(element.offsetTop <= getScroll().top){
				element.style.top = getScroll().top + 'px';
			}

			// console.log(element.offsetLeft + ' ' + element.offsetTop)
		});
	}
	return this;
}

//获取窗口大小
Base.prototype.getClient = function(){
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
Base.prototype.getBigSize = function(){
	return{
		width: (document.documentElement.scrollWidth > document.documentElement.clientWidth)? document.documentElement.scrollWidth :document.documentElement.clientWidth,
		height: (document.documentElement.scrollHeight > document.documentElement.clientHeight)? document.documentElement.scrollHeight :document.documentElement.clientHeight
	}
}

//绑定事件
Base.prototype.bind = function (event, fn) {
	for (var i = 0; i < this.elements.length; i ++) {
		this.addEvent(this.elements[i], event, fn);
	}
	return this;
};

Base.prototype.off = function (event, fn){
    for (var i = 0; i < this.elements.length; i ++) {
        this.removeEvent(this.elements[i], event, fn);
    }
    return this;
};

// 
// 
//添加事件
Base.prototype.addEvent = function(element, type, handler, callback){
	if(element.addEventListener){
		element.addEventListener(type, handler, false);
	}else if(element.attachEvent){
		element.attachEvent('on'+type, handler);
	}else{
		element['on'+type] = handler;
	}
	if(arguments.length == 4){
		if(typeof callback === 'function'){
			callback();
		}
	}
}

// 
// 
//移除事件
Base.prototype.removeEvent = function(element, type, handler, callback){
	if(element.removeEventListener){
		element.removeEventListener(type, handler, false);
	}else if(element.detachEvent){
		element.detachEvent('on'+type, handler);
	}else{
		element['on'+type] = null;
	}
	if(arguments.length == 4){
		if(typeof callback === 'function'){
			callback();
		}
	}
}


//---------------------------UP-------------------------------
//配对模式兼容处理默认事件和冒泡事件
Base.prototype.fixEvent = function(e){
	//属性配对
	e.target = e.srcElement;
	e.charCode = e.keyCode;
	//方法配对
	e.preventDefault = Base.prototype.fixEvent.preventDefault;
	e.stopPropagation = Base.prototype.fixEvent.stopPropagation;
	e.relatedTarget = Base.prototype.fixEvent.relatedTarget;
	return e;
}

Base.prototype.fixEvent.preventDefault = function(e){
	e.returnValue = false;
	return e;
}

Base.prototype.fixEvent.stopPropagation = function(e){
	e.cancelBubble = true;
	return e;
}

Base.prototype.fixEvent.relatedTarget = function(e){
	if(e.toElement){
        e.relatedTarget = e.toElement;
    } else if(e.fromElement){
        e.relatedTarget = e.fromElement;
    } else {
        e.relatedTarget = null;
    }
    return e;
}

// 
// 
//获取事件对象
Base.prototype.getEvent = function(e){
	return e || window.event;
}

// 
// 
//获取事件目标对象
Base.prototype.getTarget = function(e){
    return e.target || e.srcElement;
}

// 
// 
//获取事件关联对象
Base.prototype.getRelatedTarget = function(e){
    if(e.relatedTarget){
        return e.relatedTarget;
    } else if(e.toElement){
        return e.toElement;
    } else if(e.fromElement){
        return e.fromElement;
    } else {
        return null;
    }
}

// 
// 
//函数绑定运行环境
Base.prototype.bindContext = function(fn){
	var _this = this;
	(function(){
		fn.call(_this,arguments);
	})()
	return this;
}

// 
// 
//函数节流
Base.prototype.throttle = function(fn){
	var _this = this;
	clearTimeout(fn.timeoutId);
	fn.timeoutId = setTimeout(function(){
		fn.call(_this);
	},100)
}

//设置动画
Base.prototype.animate = function(obj){
	var _this = this;
	for(var i = 0,len = this.elements.length; i < len; i++){
		var element = this.elements[i];

		var attr =  obj['attr'] == 'x' ? 'left' :
					obj['attr'] == 'y' ? 'top' :
					obj['attr'] == 'width' ? 'width' :
					obj['attr'] == 'height' ? 'height' :
					obj['attr'] == 'opacity' ? 'opacity' : 'left';
		var start = obj['start'] != undefined ? obj['start'] : getStyle(element, attr);
		var t = obj['t'] != undefined ? obj['t'] : 30;
		var step = obj['step'] !=undefined ? obj['step'] : 5;
		var type = obj['type'] ==0 ? 'linner' : obj['type'] == 1 ? 'buffer' : 'linner';
		var speed = obj['speed'] != undefined ? obj['speed'] : 8;
		var alter = obj['alter'];
		var target = obj['target'];

		var mul = obj['mul'];

		if(alter != undefined){
			target = alter + start;
		}

		if(attr == 'opacity'){
			step = 3;
			if(start <= 1){
				start = parseInt(start * 100);
			}
		}else{
			element.style[attr] = start + 'px';
		}

		if(start > target) step = -step;

		if (mul == undefined) {
			mul = {};
			mul[attr] = target;
		}

		clearInterval(element.timer);
        element.timer = setInterval(function(){

			//创建一个布尔值，这个值可以了解多个动画是否全部执行完毕
			var flag = false; //表示都执行完毕了

			if(attr == 'opacity'){
				var temp = parseInt(getStyle(element, attr) * 100);
				_this.css('opacity', parseInt(temp + step) / 100);
				if(step > 0 && temp >= target - step){
					_this.css('opacity', target / 100);
					flag = true;
					// console.log(target + ' ' + temp + ' ' + step)
					// console.log(getStyle(element, attr)+' '+ step)
                    clearInterval(element.timer);
				}else if(step < 0 && temp <= target - step){
					_this.css('opacity', target / 100);
					flag = true;
					// console.log(target + ' ' + temp + ' ' + step)
					// console.log(getStyle(element, attr)+' '+ step)
                    clearInterval(element.timer);
				}else if(step == 0){
					_this.css('opacity', target / 100);
					flag = true;
					// console.log(target + ' ' + temp + ' ' + step)
					// console.log(getStyle(element, attr)+' '+ step)
                    clearInterval(element.timer);
				}else{
					// console.log(target + ' ' + temp + ' ' + step)
					_this.css('opacity', parseInt(temp + step) / 100);
					// console.log(getStyle(element, attr)+' '+ step)
				}

			}else{
				//是否缓冲动画
				if(type == 'buffer'){
					step = (target - getStyle(element, attr)) / speed;
					step = step > 0 ? Math.ceil(step) : Math.floor(step);
				}

				if(step > 0 && getStyle(element, attr) >= target - step){
					element.style[attr] = target + 'px';
					flag = true;
					// console.log(getStyle(element, attr)+' '+ step)
                    clearInterval(element.timer);
				}else if(step < 0 && getStyle(element, attr) <= target - step){
					element.style[attr] = target + 'px';
					flag = true;
					// console.log(getStyle(element, attr)+' '+ step)
                    clearInterval(element.timer);
				}else if(step == 0){
					element.style[attr] = target + 'px';
					flag = true;
					// console.log(getStyle(element, attr)+' '+ step)
                    clearInterval(element.timer);
				}else{
					// console.log(getStyle(element, attr)+' '+ step)
					element.style[attr] = getStyle(element, attr) + step + 'px';
				}

			}

			if (flag) {
                clearInterval(element.timer);
				if (obj.fn != undefined) obj.fn();
			}
		}, t);
	}
	return this;
}

//插件入口
Base.prototype.extend = function(name, fn){
	Base.prototype[name] = fn;
}
