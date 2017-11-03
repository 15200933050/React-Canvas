let cx = document.getElementById('canvas');
let ctx = cx.getContext('2d');
let lay = [15,7];
let dots = [];//点
let lines = [];
let areas = [];//线

//构建
function construct(){
    let m = lay[0];
    let n = lay[1];
    for( let i = 0; i < m; i++ ){
        for(let j = 0; j < n; j++){
            let dot = {
                x : (cx.width/(m-2))*i+(Math.random()-.5)*100,
                y : (cx.height/(n-2))*j+(Math.random()-.5)*100,
                v : (Math.random()-.5)*1.5,
                ra : (Math.random()-.5)*2*Math.PI,
                _x : 0,
                va : 0.01,
            };
            dot._v = dot.v;
            dots.push(dot);
        }
    }

    let line;

    for( let i = 0; i < m; i++ ){
        for(let j = 0; j < n; j++){
            if( j%2 ) {
                if( i%2 ){
                    line = [
                        [dots[i*n+j],dots[i*n+j-1],dots[(i-1)*n+j]],
                        [dots[i*n+j],dots[i*n+j-1],dots[(i+1)*n+j]],
                        [dots[i*n+j],dots[i*n+j+1],dots[(i-1)*n+j]],
                        [dots[i*n+j],dots[i*n+j+1],dots[(i+1)*n+j]],
                    ]
                }else{
                    line = [
                        [dots[i*n+j],dots[i*n+j-1],dots[(i-1)*n+j-1]],
                        [dots[i*n+j],dots[i*n+j-1],dots[(i+1)*n+j-1]],
                        [dots[i*n+j],dots[i*n+j+1],dots[(i-1)*n+j+1]],
                        [dots[i*n+j],dots[i*n+j+1],dots[(i+1)*n+j+1]],
                    ]
                }
                lines.push(line)
            }
        }
    }
    lines.forEach(function(line){
        line.forEach(function(el){
            let k = el.every(function(item){
                return item
            });
            if(k){
                el.bg = 'rgba(0,0,0,'+(Math.random()*.2)+')';
                areas.push(el)
            }
        })
    })
}
//运动
function step(){
    render();
    dots.forEach(function(dot){
        //往返运动
        dot.ra += dot.va;
        dot.v = dot._v*Math.cos(dot.ra);
        dot.x += dot.v;
    });
    window.requestAnimationFrame(step);
}
//绘制
function render(){
    ctx.clearRect(0,0,cx.width,cx.height);
    ctx.fillStyle = '#2f46f7';
    ctx.fillRect(0,0,cx.width,cx.height);
    areas.forEach(function(area){
        ctx.beginPath();
        ctx.moveTo(area[0].x,area[0].y);
        ctx.lineTo(area[1].x,area[1].y);
        ctx.lineTo(area[2].x,area[2].y);
        ctx.closePath();
        ctx.fillStyle = area.bg;
        ctx.fill();
    });
}
window.onResize = function () {
    cx.width = cx.clientWidth;
    cx.height = cx.clientHeight;
    if (dots.length === 0) {
        construct();
    }
    render();
};
window.onResize(); // trigger the event manually.

window.requestAnimationFrame(step);