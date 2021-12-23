const palette = [];
const hexCodes = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51', '#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557'];

document.addEventListener("DOMContentLoaded", function() {
    for(let color of hexCodes){
        palette.push(getRGB(color));
    }
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const zoomOutButton = document.getElementById('zoom-out');
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    //Preparatory data for initial render.
    const screenWidth=canvas.scrollWidth;
    const screenHeight=canvas.scrollHeight;
    const maxIterations=512;
    const zoomFactor=5;
    let cartesianWidth=4;
    let cartesianHeight=4;
    let cartesianCenterX=0;
    let cartesianCenterY=0;
    let xAxisStep = cartesianWidth/screenWidth;
    let yAxisStep = cartesianHeight/screenWidth;
    let zoomLevel=0;
    draw(screenWidth, screenHeight, cartesianCenterX, cartesianCenterY, xAxisStep, yAxisStep,
         maxIterations, ctx);
    canvas.addEventListener("click", function(event){
        console.log(loaderElement.style);
        zoomLevel++;
        cartesianCenterX = cartesianCenterX + (xAxisStep*(event.clientX-(screenWidth/2)));
        cartesianCenterY = cartesianCenterY + (yAxisStep*(event.clientY-(screenHeight/2)));
        xAxisStep/=zoomFactor;
        yAxisStep/=zoomFactor;
        draw(screenWidth, screenHeight, cartesianCenterX, cartesianCenterY, xAxisStep, yAxisStep, 
            maxIterations, ctx);
    });
    zoomOutButton.addEventListener("click", function(event){
        if(zoomLevel>1){
            xAxisStep*=zoomFactor;
            yAxisStep*=zoomFactor;
            draw(screenWidth, screenHeight, cartesianCenterX, cartesianCenterY, xAxisStep, yAxisStep, 
                maxIterations, ctx);
        }else if(zoomLevel==1){
            cartesianCenterX=0;
            cartesianCenterY=0;
            xAxisStep = cartesianWidth/screenWidth;
            yAxisStep = cartesianHeight/screenWidth;
            draw(screenWidth, screenHeight, cartesianCenterX, cartesianCenterY, xAxisStep, yAxisStep, 
                maxIterations, ctx);
        }
        zoomLevel = (zoomLevel>0) ? zoomLevel-- : 0;
    });
});

function draw(screenWidth, screenHeight, centerX, centerY, xStep, yStep, maxIterations, canvasCtx){
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
                canvasCtx.fillStyle = getColor(palette.length*(iterations/maxIterations),palette);
            }else{
                canvasCtx.fillStyle = 'rgba(220,220,220)';
            }
            canvasCtx.fillRect(px,py,1,1);
        }
    }
}

function getColor(h, palette) {
    let clr1 = Math.floor(h);
    let t2 = h-clr1;
    let t1 = 1-t2;
    clr1 = clr1%palette.length;
    let clr2 = (clr1+1)%palette.length;
    let r = Math.round(palette[clr1].r*t1)+Math.round(palette[clr2].r*t2); 
    let g = Math.round(palette[clr1].g*t1)+Math.round(palette[clr2].g*t2); 
    let b = Math.round(palette[clr1].b*t1)+Math.round(palette[clr2].b*t2); 
    return 'rgb('+r+','+g+','+b+')';  
}   

function getRGB(color){
    let r,g,b;
    if(color.length == 7){
      r = parseInt(color.substr(1,2),16);
      g = parseInt(color.substr(3,2),16);
      b = parseInt(color.substr(5,2),16);    
    } else{
        r=0;
        g=0;
        b=0;
    }
    return {'r': r, 'g': g, 'b': b} ;
      
}