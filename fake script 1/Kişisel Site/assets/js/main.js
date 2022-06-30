/*============================================
  * Author      : Arabey Mohamed
  * Project     : Prop | Personal Portfolio HTML Template
  * Version     : 1.0
  * Primary use : Portfolio 

  
/*global consol, if, prompt, function, smoothScroll, alert, document, window, var, mixItUp, $ */
(function($) { 
    "use strict"; 
    
    
    /*=====================================
    Start mixItUp My Work
    =====================================*/
    $('#Container').mixItUp();
    
    /*=====================================
    Start Header
    =====================================*/
	var theToggle = document.getElementById('toggle');
// hasClass
function hasClass(elem, className) {
	return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}
// addClass
function addClass(elem, className) {
    if (!hasClass(elem, className)) {
    	elem.className += ' ' + className;
    }
}
// removeClass
function removeClass(elem, className) {
	var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
	if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}
// toggleClass
function toggleClass(elem, className) {
	var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, " " ) + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(" " + className + " ") >= 0 ) {
            newClass = newClass.replace( " " + className + " " , " " );
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
        elem.className += ' ' + className;
    }
}

theToggle.onclick = function() {
   toggleClass(this, 'on');
   return false;
}


/* Nvabar Responsive */
if (matchMedia('only screen and (max-width: 1024px)').matches) {
    $('#toggle').on("click", function() {
       $('#swift-canvas').toggleClass("back-responsive");
       $(".btn").toggleClass("btn-z");
    });
}



/*=====================================
    Start Typed
=====================================*/
   $(function () {
        $("#typed").typed({
            stringsElement: $('#typed-strings'),
            typeSpeed: 0,
            startDelay: 0,
            backSpeed: 0,
            backDelay: 1500,
            loop: true,
            loopCount: false,
            showCursor: false,
            cursorChar: "|",
            attr: null,
            contentType: 'html'
        });
    });

/*=====================================
    Start Canvas
=====================================*/

            
(function() {

    var width, height, largeHeader, canvas, ctx, circles, target, animateHeader = true;

    // Main
    initHeader();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: 0, y: height};

        largeHeader = document.getElementById('large-header');
        //largeHeader.style.height = height+'px';

        canvas = document.getElementById('swift-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create particles
        circles = [];
        for(var x = 0; x < width*0.5; x++) {
            var c = new Circle();
            circles.push(c);
        }
        animate();
    }

    // Event handling
    function addListeners() {
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        //largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in circles) {
                circles[i].draw();
            }
        }
        requestAnimationFrame(animate);
    }

    // Canvas manipulation
    function Circle() {
        var _this = this;

        // constructor
        (function() {
            _this.pos = {};
            init();
//            console.log(_this);
        })();

        function init() {
            _this.pos.x = Math.random()*width;
            _this.pos.y = height+Math.random()*100;
            _this.alpha = 0.1+Math.random()*0.3;
            _this.scale = 0.1+Math.random()*0.3;
            _this.velocity = Math.random();
        }

        this.draw = function() {
            if(_this.alpha <= 0) {
                init();
            }
            _this.pos.y -= _this.velocity;
            _this.alpha -= 0.0005;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.scale*10, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(255,255,255,'+ _this.alpha+')';
            ctx.fill();
        };
    }

})();
    
    
/*=====================================
    Start Button My Work
=====================================*/
    
    $('.section-work .mywork .button-mywork button').on("click",function () {
        $('.section-work .mywork .button-mywork button').removeClass('active');
        $(this).addClass('active');
    });
    

/*=====================================
    Start Open Image My Work
=====================================*/
    $('.section-work').magnificPopup({
        delegate: 'a', // child items selector, by clicking on it popup will open
        type: 'image',
        gallery: {enabled: true}
      // other options
    });
    
    
/*=====================================
    Start TESTIMONIALS
=====================================*/
    var owl = $('.owl-carousel');
    owl.owlCarousel({
        items:1,
        loop:true,
        margin:10,
        autoplay:true,
        autoplayTimeout:5000,
        autoplayHoverPause:true
    });
    
    
/*=====================================
    Start Top Button click
=====================================*/
    var body = $('body, html');
    // to top button (1- on click)
    
    $(".to_top").on("click" ,function(){
        body.animate({scrollTop : 0}, 600);   
    });
     
    
    // Hide Top Button And Show        
    var scrollTop = $("#to_top");

	$(window).scroll(function () {
        if ($(this).scrollTop() >= 300) {
            scrollTop.fadeIn(500);
        } else {
                scrollTop.fadeOut(500);
        }
	});
    
    
/*=====================================
    Smooth Scroll
=====================================*/
	smoothScroll.init({
		speed: 800,
        offset: 0
	});
    
    
/*=====================================
    Start Loading
=====================================*/          
    $(window).on('load', function () {

        $('.Loading').fadeOut(500);
    });
    
})(jQuery);
