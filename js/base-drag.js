//元素拖拽
$().extend('drag',function(arg){
	var target = arg.target;
    var container = arg.container;
    var pattern = /array/i;
    var type = Object.prototype.toString.call(target);
	for(var i = 0;i<this.elements.length;i++){
		var _this = this;
		var element = this.elements[i];
		var clientWidth = 0;
		var clientHeight = 0;
		var diffX = 0;
	    var diffY = 0;

		_this.addEvent(element, 'mousedown', mousedown);

		function mousedown(e){
			var e = e || window.event;
			diffX=e.clientX + getScroll().left - this.offsetLeft;
	        diffY=e.clientY + getScroll().top - this.offsetTop;

	        var flag = false;
            if(pattern.test(type)){
                for(var i = 0;i<target.length;i++){
                    if(e.target == target[i]){
                        flag = true;
                    }
                }
            }else if(e.target == target){
                flag = true;
            }

	        if(flag){
	        	_this.addEvent(document, 'mousemove', mousemove);
				_this.addEvent(document, 'mouseup', mouseup);
	        }else{
	        	_this.removeEvent(document, 'mousemove', mousemove);
        		_this.removeEvent(document, 'mouseup', mouseup);
	        }
		}
		function mousemove(e){
        	var e = e || window.event;
        	e.preventDefault(e);
        	if(typeof element.setCapture != 'undefined'){
				element.setCapture();
			}
        	var left = e.clientX + getScroll().left  - diffX;
            var top = e.clientY + getScroll().top  - diffY;


            clientWidth = getStyle(container, 'width') + getScroll().left;
			clientHeight = getStyle(container, 'height') + getScroll().top;

            if(left <= getScroll().left){
        		left = getScroll().left;
        	} else if(left > clientWidth  - element.offsetWidth){
        		left = clientWidth - element.offsetWidth;
        	}

        	if(top <= getScroll().top){
        		top = getScroll().top;
        	}else if(top > clientHeight - element.offsetHeight){
        		top = clientHeight- element.offsetHeight;
        	}

        	if(left <= getScroll().left){
        		left = getScroll().left;
        	}

        	if(top <= getScroll().top){
        		top = getScroll().top;
        	}

        	// console.log(element.offsetLeft + ' ' + element.offsetTop)
        	// console.log(top + ' ' + left + ' ' + getScroll().top + ' ' + diffY);
            element.style.left = left+"px";
            element.style.top = top+"px";
        }
        function mouseup(e){
        	if(typeof element.releaseCapture != 'undefined'){
        		element.releaseCapture();
        	}
        	_this.removeEvent(document, 'mousemove', mousemove);
        	_this.removeEvent(document, 'mouseup', mouseup);
        }
	}
})