const palette = [{'r': 139, 'g': 201, 'b':217}, {'r': 25, 'g': 70, 'b':133}, {'r': 1, 'g': 114, 'b':189}, {'r': 215, 'g': 178, 'b':151}, 
                 {'r': 230, 'g': 207, 'b':184}, {'r': 36, 'g': 160, 'b':216}, {'r': 249, 'g': 227, 'b':148}, {'r': 249, 'g': 212, 'b':118},
                 {'r': 255, 'g': 189, 'b':189}, {'r': 255, 'g': 209, 'b':221}, {'r': 255, 'g': 228, 'b':232}, {'r': 255, 'g': 236, 'b':161}, 
                 {'r': 50, 'g': 165, 'b':141}, {'r': 23, 'g': 48, 'b':88}, {'r': 121, 'g': 128, 'b':199}, {'r': 219, 'g': 158, 'b':210}];


document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    //Preparatory data for initial render.
    const screenWidth=canvas.scrollWidth;
    const screenHeight=canvas.scrollHeight;
    const maxIterations=1024;
    const zoomFactor=5.2;
    let cartesianWidth=4;
    let cartesianHeight=4;
    let cartesianCenterX=0;
    let cartesianCenterY=0;
    let xAxisStep = cartesianWidth/screenWidth;
    let yAxisStep = cartesianHeight/screenWidth;
    draw(screenWidth, screenHeight, cartesianCenterX, cartesianCenterY, xAxisStep, yAxisStep,
         maxIterations, ctx);
    canvas.addEventListener("click", function(event){
        cartesianCenterX = cartesianCenterX + (xAxisStep*(event.clientX-(screenWidth/2)));
        cartesianCenterY = cartesianCenterY + (yAxisStep*(event.clientY-(screenHeight/2)));
        xAxisStep/=zoomFactor;
        yAxisStep/=zoomFactor;
        draw(screenWidth, screenHeight, cartesianCenterX, cartesianCenterY, xAxisStep, yAxisStep, 
            maxIterations, ctx);
    });
});

function draw(screenWidth, screenHeight, centerX, centerY, xStep, yStep, maxIterations, canvasCtx){
    alert("Commence");
    let maxMagnitude=4;
    let xnew;
    let ynew;
    for(let px=0;px<screenWidth;px++){
        for(let py=0;py<screenHeight;py++){
            let iterations = 0;
            let x0 = centerX + (xStep*(px-(screenWidth/2)));
            let y0 = centerY + (yStep*(py-(screenHeight/2)));
            let xp = x0;
            let yp = y0;
            let magnitude = (xp*xp) + (yp*yp);
            while(iterations<maxIterations && magnitude<maxMagnitude){
                xnew = (xp*xp)-(yp*yp)+x0;
                ynew = (2*(xp*yp))+y0;
                magnitude=(xnew*xnew) + (ynew*ynew);
                xp=xnew;
                yp=ynew;
                iterations++;
            }
            if(iterations<maxIterations){
                let logZn = Math.log(magnitude)/2;
                let ns = (Math.log(logZn/(Math.log(2))))/Math.log(2);
                iterations = 1+iterations-ns;
                // let hue = 0;
                // let saturation = 1;
                let value=iterations/maxIterations;
                let colorVal = Math.round((palette.length-1)*value);
                // let rgb = hsv2rgb(hue, saturation, value);
                canvasCtx.fillStyle = 'rgb('+palette[colorVal].r+', '+palette[colorVal].g+', '+palette[colorVal].b+')';
            }else{
                canvasCtx.fillStyle = 'rgb(0,0,0)';
            }
            canvasCtx.fillRect(px,py,1,1);
        }
    }
    alert("Fin");
}

function hsv2rgb(h,s,v) 
{                              
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [Math.round(f(5)*255),Math.round(255*f(3)),Math.round(255*f(1))];       
}   

