var MatrixEngine = (function() 
{
	var canvas, ctx;
	var particles = [];
	var mx, my;
	var dx, dy;
	
	function mouseMoveHandler(e)
	{
		e.preventDefault();
		mx = e.clientX;
		my = e.clientY;
	}
	
	function clickHandler(e)
	{
		e.preventDefault();
		particles.push(new Particle(mx, my));
	}
	
	function resizeHandler()
	{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	
	function setUpCanvas() 
	{
		canvas = document.getElementById('feild');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		if (canvas.getContext) {
			ctx = canvas.getContext('2d');
		}
	}
	
	function Particle(x, y) 
	{
		this.x = x;
		this.y = y;
		
		this.vx = -4 + Math.random() * 30;
		this.vy = -4 + Math.random() * 30;
		
		this.radius = 20 + Math.random() * 40;
		this.life = 100 + Math.random() * 500;
		
		this.r = Math.round(Math.random() * 255);
		this.g = Math.round(Math.random() * 255);
		this.b = Math.round(Math.random() * 255);
		this.opacity = 1.0;
	}
	
	function DistanceHandler(p1, p2, p1Index, p2Index)
	{
		dx = p2.x - p1.x;
		dy = p2.y - p1.y;
		
		var dist = Math.sqrt(dx * dx + dy * dy);
		var radiusSum = p1.radius + p2.radius;
		if (dist <= radiusSum) {
			if (p1.radius >= p2.radius) {
				p1.radius += p2.radius;
				particles.splice(p2Index, 1);
				
			}
			else {
				p2.radius += p1.radius;
				particles.splice(p1Index, 1);
			}
		}
	}
	
	function run() 
	{
		ctx.globalCompositeOperation = 'source-over';
		ctx.fillStyle = '#212121';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalCompositeOperation = 'lighter';
		
		for (var i = 0; i < particles.length; ++i) 
		{
			var p = particles[i]
			
			ctx.beginPath();
			ctx.fillStyle = 'rgba(' + p.r + ', ' + p.g + ', ' + p.b + ', ' + p.opacity + ')';
			ctx.arc(p.x, p.y, p.radius, Math.PI * 2, false);
			ctx.fill();
				
			p.x += p.vx;
			p.y += p.vy;
			
			if ((p.x + p.radius) > canvas.width || (p.x - p.radius) < 0) {
				p.vx *= -1;
			}
			
			if  ((p.y + p.radius) > canvas.height || (p.y - p.radius) < 0) {
				p.vy *= -1;
			}
			
			for (var j = i + 1; j < particles.length; ++j) {
				var p2 = particles[j];
				
				DistanceHandler(p, p2, i, j);
			}
			
			//p.radius -= 0.5;
			p.life -= 0.5;
			
			if (p.radius <= 0 || p.life <= 0) {
				particles.splice(i, 1);
			}
		}
		
		//setTimeout(run, 1000/60)
		window.webkitRequestAnimationFrame(run);
	}
	
	return {
		init: function() 
		{
			setUpCanvas();
			canvas.addEventListener('mousemove', mouseMoveHandler, false);
			canvas.addEventListener('click', clickHandler, false);
			window.addEventListener('resize', resizeHandler, false);
			run();
		}
	};
})()

window.addEventListener('load', MatrixEngine.init, false);