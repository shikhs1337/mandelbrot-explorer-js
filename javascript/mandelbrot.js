const palette = [[139, 201,217], [ 25, 70,133], [ 1, 114,189], [ 215, 178,151], 
                 [ 230, 207,184], [ 36, 160,216], [ 249, 227,148], [ 249, 212,118],
                 [ 255, 189,189], [ 255, 209,221], [ 255, 228,232], [ 255, 236,161], 
                 [ 50, 165,141], [ 23, 48,88], [ 121, 128,199], [ 219, 158,210]];


let screenWidth, screenHeight;
const maxMagnitude = 4;
const maxIterations=16384;
const zoomFactor=5.2;

let mandelbrot;
const mandelbrotGenerator = function(centerX, centerY, xStep, yStep, screenWidth, screenHeight, maxIterations, maxMagnitude, palette, paletteLength){
    let iterations = 0;
    let x0 = centerX + (xStep*(this.thread.x-(screenWidth/2)));
    let y0 = centerY + (yStep*(this.thread.y-(screenHeight/2)));
    let xp = x0;
    let yp = y0;
    let magnitude = (xp*xp) + (yp*yp);
    while(iterations<maxIterations && magnitude<maxMagnitude){
        let xnew = (xp*xp)-(yp*yp)+x0;
        let ynew = (2*(xp*yp))+y0;
        magnitude=(xnew*xnew) + (ynew*ynew);
        xp=xnew;
        yp=ynew;
        iterations++;
    }
    if(iterations<maxIterations){
        let logZn = Math.log(magnitude)/2;
        let ns = (Math.log(logZn/(Math.log(2))))/Math.log(2);
        iterations = 1+iterations-ns;
        let value=iterations/maxIterations; 
        let colorVal = Math.round((paletteLength-1)*value);
        return colorVal;
    }
    return -1;
};

document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    //Preparatory data for initial render.
    screenWidth=canvas.scrollWidth;
    screenHeight=canvas.scrollHeight;
    let cartesianWidth=4;
    let cartesianHeight=4;
    let cartesianCenterX=0;
    let cartesianCenterY=0;
    let xAxisStep = cartesianWidth/screenWidth;
    let yAxisStep = cartesianHeight/screenWidth;
    mandelbrot = gpu.createKernel(mandelbrotGenerator, {
        output: [screenWidth, screenHeight],
        loopMaxIterations: maxIterations,
    });
    let gpuArr = mandelbrot(cartesianCenterX, cartesianCenterY, xAxisStep, yAxisStep, screenWidth, screenHeight, maxIterations, maxMagnitude, palette, palette.length);
    newDraw(gpuArr, ctx);
    canvas.addEventListener("click", function(event){
        cartesianCenterX = cartesianCenterX + (xAxisStep*(event.clientX-(screenWidth/2)));
        cartesianCenterY = cartesianCenterY + (yAxisStep*(event.clientY-(screenHeight/2)));
        xAxisStep/=zoomFactor;
        yAxisStep/=zoomFactor;
        gpuArr = mandelbrot(cartesianCenterX, cartesianCenterY, xAxisStep, yAxisStep, screenWidth, screenHeight, maxIterations, maxMagnitude, palette, palette.length);
        newDraw(gpuArr, ctx);
    });
});

function newDraw(gpuArr, ctx){
    let row;
    for(let i=0;i<gpuArr.length;i++){
        row=gpuArr[i];
        for(let j=0;j<row.length;j++){
            ctx.fillStyle=row[j]!=-1 ? 'rgb('+palette[row[j]][0]+','+palette[row[j]][1]+','+palette[row[j]][2]+')' : 'rgb(0,0,0)';
            ctx.fillRect(j,i,1,1);
        }
    }
}  

