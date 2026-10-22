let drawingEnabled = false;

let strokesLeft = 0;

let strokeCount = [];

let startDrawing = false;

let currentStrokeWeight = 12;

let fps = 12; 

let currentStrokeColor = 0;

let currentTexture = 0;

let card0Weight = 0;
let card1Weight = 0;
let card2Weight = 0;

let card0, card1, card2;

let cursor;

let dice;
let diceImage;
let diceIndex = 0;
let diceFrames = 13;

let overlay;

let usingTexture = false;

let card0UseTexture = false;
let card1UseTexture = false;
let card2UseTexture = false;

let card0Texture = 0;
let card1Texture = 0;
let card2Texture = 0;

let card0Color = 0;
let card1Color = 0;
let card2Color = 0;

let card0reset = false;
let card1reset = false;
let card2reset = false;

let card0Image;
let card1Image;
let card2Image;

let assigned = false;

let cardSelected = false;

let diceRolled = false;

let dragCounter = 0;

let dragThreshold = 3;

// let resetCards = false;

// references:
// Simple Draw Program by Huiyi https://editor.p5js.org/Huiyi/sketches/uhiYBB2QI
//fill rect with image copy https://editor.p5js.org/noahthompson111/sketches/cYbTU3kRx
//Mirror Image Play by slustgarten https://editor.p5js.org/slustgarten/sketches/DVVvUnXM2
// enabling disabling dom elements https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
//p5 instancing https://p5js.org/reference/p5/p5/ 
// request animation frame, animating without p5 for doms https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
// bezier curve https://www.desmos.com/calculator/ebdtbxgbq0 

let pg; 

let im;

let textures = [];

let numbers = [];

let die = [];

let cards = [];

let numTextures = 18;

let MaxWeight = 32;

let MinWeight = 6;


//#region Loading/Setup
function loadTextures(p){
    for(let i = 0; i < numTextures; i++){
        let png = p.loadImage(`assets/textures/tex${i}.png`);
        textures.push(png);
    }

    for(let i = 0; i < 4; i++){
        let png = p.loadImage(`assets/cards/card${i}.png`);
        cards.push(png);
    }
    
}

function loadDice(p){
    for(let i = 0; i < diceFrames; i++){
        let png = p.loadImage(`assets/dice/dice${i}.png`);
        die.push(png);
    }
    
}

function loadNumbers(p){
    for(let i = 0; i < 7; i++){
        let num = p.loadImage(`assets/numbers/num${i}.png`);
        numbers.push(num);
    }
}

function GetElements(){
    card0 = document.getElementById("card0");
    card1 = document.getElementById("card1");
    card2 = document.getElementById("card2");

    card0Image = document.getElementById("card0Image");
    card1Image = document.getElementById("card1Image");
    card2Image = document.getElementById("card2Image");

    dice = document.getElementById("dice");
    diceImage = document.getElementById("diceImage");

    number = document.getElementById("number");

    overlay = document.getElementById("overlay");

    cursor = document.getElementById("cursor");
}

//#endregion


// #region Canvas

function mainSketch(p){
    p.preload = function (){
        im = p.loadImage("assets/textures/tex0.png");
        
        GetElements();

        loadTextures(p);

        loadDice(p);

        DisableDrawTurn();
        EnableDrawTurn();
    }

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.background(255);

        //lets us mask texture with shape for brush
        pg = p.createGraphics(512, 512);

        pg.background(255);

        // make image elements after preload

        new p5(card0Sketch, card0);
        new p5(card1Sketch, card1);
        new p5(card2Sketch, card2);
        new p5(cursorSketch, cursor);
    }

    p.draw = function(){
        p.colorMode(p.HSB);
        p.blendMode(p.DARKEST);

        SetNumberFrame();

        if(strokesLeft > 0){
        //holding click
        if (startDrawing && drawingEnabled) {
            if(p.mouseIsPressed){
                //dont falsely take away strokes from accidental clicks
                let distance = p.dist(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
                if(distance >= 0.0001){
                    dragCounter++;
                }
            }

            //depending on card chose either texture brush or line
            if(usingTexture){
                pg.image(textures[currentTexture],0,0,im.width,im.height);
                DrawTexture(p);
            }
            else{
                p.stroke(currentStrokeColor,100,100);
                p.strokeWeight(currentStrokeWeight);
                p.line(p.pmouseX - p.width / 2,p.pmouseY - p.height / 2,p.mouseX - p.width / 2,p.mouseY - p.height / 2);
            }
        }
        }
        //start draw turn once out of strokes
        else{
            EnableDrawTurn();
        }
    }

    //dont falsely take away strokes from accidental clicks
    
    p.mousePressed = function() {
         startDrawing = true;
    }

    p.mouseReleased = function() {
        startDrawing = false;
        if(dragCounter >= dragThreshold){
            strokesLeft -= 1;
        }
        dragCounter = 0;
    }
}

function cursorSketch(p){
    p.preload = function (){
    }

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    }

    p.draw = function(){
        // clear and no fill for showing position and size of brush
        p.clear();
        p.colorMode(p.HSB);
        p.blendMode(p.DARKEST);

        if(drawingEnabled){
            p.noFill();
            p.ellipse(p.mouseX - p.width / 2,p.mouseY - p.height / 2, currentStrokeWeight);
        }

    }
}
//could have made this into one larger function but just brute forced since its only 3 cards. not scalable at this level but easiest to get working

function card0Sketch(p){
    p.setup = function(){
        p.createCanvas(275,425);
    }

    p.draw = function(){
        // p.background(0);    
        if(card0reset){
            p.clear();
            card0reset = false;
        }

        p.imageMode(p.CENTER);
        if(card0UseTexture){
            p.image(textures[card0Texture], p.width / 2, p.height / 2 - 64, 128, 128);
        }
        else{
            p.rectMode(p.CENTER);   
            p.colorMode(p.HSB);
            p.fill(card0Color,100,100);
            p.rect(p.width / 2, p.height / 2 - 64, 128,128);
        }

        p.fill(255);
        p.ellipse(p.width / 2, p.height / 2 + 64, card0Weight);

    }
}

function card1Sketch(p){
    p.setup = function(){
        p.createCanvas(275,425);
    }

    p.draw = function(){
        // p.background(0);
           if(card1reset){
            p.clear();
            card1reset = false;
        } 
        p.imageMode(p.CENTER);
        if(card1UseTexture){
        p.image(textures[card1Texture], p.width / 2, p.height / 2 - 64, 128, 128);
        }
        else{
            p.rectMode(p.CENTER);   
            p.colorMode(p.HSB);
            p.fill(card1Color,100,100);
            p.rect(p.width / 2, p.height / 2 - 64, 128,128);
        }

        
        p.fill(255);
        p.ellipse(p.width / 2, p.height / 2 + 64, card1Weight);
    }
}

function card2Sketch(p){
    p.setup = function(){
        p.createCanvas(275,425);
    }

    p.draw = function(){
         if(card2reset){
            p.clear();
            card2reset = false;
        }

        // p.background(0);
        p.imageMode(p.CENTER);
        if(card2UseTexture){
            p.image(textures[card2Texture], p.width / 2, p.height / 2 - 64, 128, 128);
        }
         else{
            p.rectMode(p.CENTER);   
            p.colorMode(p.HSB);
            p.fill(card2Color,100,100);
            p.rect(p.width / 2, p.height / 2 - 64, 128,128);
        }


        p.fill(255);
        p.ellipse(p.width / 2, p.height / 2 + 64, card2Weight);
    }
}

// brush function, i didn't like that if moving too fast when drawing shapes it would leave gaps, so i tried filling it in linearly. has issues:
// slow performance because it insantiates so many more images per frame than normal, and because of this it also causes sharp edges from lerp

function DrawTexture(p){
    let distance = p.dist(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
    if (distance > 0) {
        for (let d = 0; d <= distance; d += currentStrokeWeight / 2) {
            let t = d / distance; 

            let x = p.lerp(p.pmouseX - p.width / 2, p.mouseX- p.width / 2, t);
            let y = p.lerp(p.pmouseY - p.height / 2, p.mouseY - p.height / 2, t);
            
            p.push();
            p.texture(pg);
            p.noStroke();
            p.strokeWeight(0);
            p.ellipse(x, y, currentStrokeWeight, currentStrokeWeight);
            p.pop();
        }
        }
}

// #endregion

// #region Card Logic

//set global parameters from card parameters 
function SelectCard0(){
    card0.classList.remove("unselected");
    currentStrokeWeight = card0Weight;
    if(card0UseTexture){
        currentTexture = card0Texture;
        usingTexture = true;
    }
    else{
        currentStrokeColor = card0Color;
        usingTexture = false;
    }
    
    card1.classList.add("unselected");
    card2.classList.add("unselected");
    
    cardSelected = true;
    if(diceRolled){
        waitToEndTurn();
    }
}

function SelectCard1(){
    card1.classList.remove("unselected");
    currentStrokeWeight = card1Weight;
        if(card1UseTexture){
        currentTexture = card1Texture;
        usingTexture = true;
    }
    else{
        currentStrokeColor = card1Color;
        usingTexture = false;
    }

    card0.classList.add("unselected");
    card2.classList.add("unselected");

    cardSelected = true;
    if(diceRolled){
        DisableDrawTurn();
    }
}

function SelectCard2(){
    card2.classList.remove("unselected");
    currentStrokeWeight = card2Weight;
    
    if(card2UseTexture){
        currentTexture = card2Texture;
        usingTexture = true;
    }
    else{
        currentStrokeColor = card2Color;
        usingTexture = false;
    }

    card1.classList.add("unselected");
    card0.classList.add("unselected");

    cardSelected = true;
    if(diceRolled){
        DisableDrawTurn();
    }
}


function AssignCard0(){
    card0Image.src = `assets/cards/card${Math.floor(Math.random() * 4)}.png`
    card0Texture = Math.floor(Math.random() * numTextures);
    card0Weight = Math.floor(Math.random() * MaxWeight) + MinWeight;
    card0Color = Math.random() * 360;
    
    let rand = Math.random();

    if(rand > 0.3){
        card0UseTexture = true;
    }else{
        card0UseTexture = false;
    }
}

function AssignCard1(){
    card1Image.src = `assets/cards/card${Math.floor(Math.random() * 4)}.png`
    card1Texture = Math.floor(Math.random() * numTextures);
    card1Weight = Math.floor(Math.random() * MaxWeight) + MinWeight;
    card1Color = Math.random() * 360;

     let rand = Math.random();
    if(rand > 0.3){
        card1UseTexture = true;
    }else{
        card1UseTexture = false;
    }

}

function AssignCard2(){
    card2Image.src = `assets/cards/card${Math.floor(Math.random() * 4)}.png`
    card2Texture = Math.floor(Math.random() * numTextures);
    card2Weight = Math.floor(Math.random() * MaxWeight) + MinWeight;
    card2Color = Math.random() * 360;

    let rand = Math.random();
    if(rand > 0.3){
        card2UseTexture = true;
    }else{
        card2UseTexture = false;
    }
}

//disable continual clicks, set the stroke count, and trigger end if card selected
function RollStrokes(){
    if(!diceRolled){
    diceRolled = true;
    strokesLeft = Math.floor(Math.random() * 5) + 1;
    SetNumberFrame();
    diceImage.src = `assets/dice/dice${strokesLeft - 1}.png`
    if(cardSelected){
        waitToEndTurn();
    }
    }
}


// unselected class adds to css and turns off pointer events and opacity. 

function DisableDrawTurn(){
    if(assigned){
        assigned = false;
    }

    cardSelected = false;
    diceRolled = false;

    card0.classList.remove("unselected");
    card1.classList.remove("unselected");
    card2.classList.remove("unselected");

    card0.classList.add("disabled");
    card1.classList.add("disabled");
    card2.classList.add("disabled");

    dice.classList.add("disabled");

    overlay.classList.add("disabled");
    
    drawingEnabled = true;
    
}

//assigns cards their values, ensure they are all enabled, set scale to 0 so they are still invisible, then bring them in with animation

function EnableDrawTurn(){
    if(!assigned){
    card0reset = true;
    card1reset = true;
    card2reset = true;

    
        AssignCard0();
        AssignCard1();
        AssignCard2();
        assigned = true;
    

    card0.classList.remove("disabled");
    card1.classList.remove("disabled");
    card2.classList.remove("disabled");

    dice.classList.remove("disabled");

    overlay.classList.remove("disabled");

    card0.style.transform = `scale(0.0)`;
    card1.style.transform = `scale(0.0)`;
    card2.style.transform = `scale(0.0)`;

    diceImage.style.transform = `scale(0.0)`;

    bringInCards();

    // overlay.style.backgroundColor = "rgba(0,0,0,0.5)";

    drawingEnabled = false;
    }
}

// #endregion


//unfinished implementation, i wanted to rotate the texture randomly and then mirror it so there are more options, 
// but dealing with the different coordinate systems was messing with me

//rotate would displace the image too far, im sure theres a way around it but i just skipped for now

// function setup (){
//   createCanvas(windowWidth, windowHeight, WEBGL);
//   background(255);

//   RollStrokes();

//     // Create the p5.Graphics object.
//   pg = createGraphics(512, 512);

//   pg.background(255);

// //   pg.image(im, 0, 0, im.width / 2,im.height / 2);
  
// //   pg.push();
// //   pg.scale(-1,1);
// //   pg.image(im, -im.width, 0, im.width / 2,im.height / 2);
// //     pg.pop();

// //     pg.push()
// //     pg.scale(1,-1);
// //      pg.image(im, 0, -im.height, im.width / 2,im.height / 2);
// //      pg.pop();

// //      pg.push();
// //      pg.scale(-1,-1);
// //       pg.image(im, -im.width, -im.height, im.width / 2,im.height / 2);
// //     pg.pop();


//     pg.image(textures[0],0,0,im.width,im.height);
// }

new p5(mainSketch);

// #region Animation

//here we start doing animation stuff outside of the draw loop so we can trigger movements without loop or messing with a bunch of bools

//just waiting for visual clarity
function waitToEndTurn(duration = 150){
    let start = performance.now()

    function frame(now){
        let time = Math.min((now - start) / duration, 1);

        if(time < 1) requestAnimationFrame(frame);
        else{
         DisableDrawTurn();
        }
    }
    requestAnimationFrame(frame);
}

//don't really understand the math here at all but its pretty easy to implement to code for curves
function getQuarticBezierPoint(t, p0,p1,p2,p3,p4){

  let x = Math.pow((1-t),4)*p0[0] + 4*Math.pow((1-t),3) * t * p1[0] + 6*Math.pow((1 - t),2) * (t * t) * p2[0] + 4 * (1 - t) * Math.pow(t,3) * p3[0] + Math.pow(t,4) * p4[0]; 

  let y = Math.pow((1-t),4)*p0[1] + 4*Math.pow((1-t),3) * t * p1[1] + 6*Math.pow((1 - t),2) * (t * t) * p2[1] + 4 * (1 - t) * Math.pow(t,3) * p3[1] + Math.pow(t,4) * p4[1];

  return [x,y];
}

//used for cards and dice, uses five control points for squash and stretch. very similar function to one's i have in c# for ui animation
function animateScaleGeneral(element, duration=500, startscale= 0.0,endscale=1.0, centered = false) {
  let start = performance.now();

  function frame(now) {
    let time = Math.min((now - start) / duration, 1);
    let progress = getQuarticBezierPoint(time, [0,0],[0.25,0.5],[0.5,1.5],[0.8,0.8], [1.0,1.0])[1];
    let scale = startscale + (endscale - startscale) * progress;

    if(!centered){
    element.style.transform = `scale(${scale})`;
    }
    //needed for dice, i wish there was way to append to the transforms instead of replace
    else{
        element.style.transform = `translateX(-50%) scale(${scale})`;
    }

    if (time < 1) requestAnimationFrame(frame);
  }
requestAnimationFrame(frame);
}

function SetNumberFrame(){
    number.src = `assets/numbers/num${strokesLeft}.png`;
}

//first six images are final dice rolls, next six images are mid rolling. for animating we just randomly pick from rolling frames.

function animateDice(duration = 750, fps = 24){
    if(diceRolled) return;
    let start = performance.now();
    let last = start;

    function frame(now){
        let time = Math.min((now - start) / duration, 1);
        if(now - last >= 1000 / fps){
            diceIndex = Math.floor(Math.random() * 6) + 6;
            diceImage.src = `assets/dice/dice${diceIndex}.png`

            last = now;
        }
        if(time < 1.0) {
        requestAnimationFrame(frame);
        }
        else{
            RollStrokes();
        }
    }
    requestAnimationFrame(frame);
}

//use linear curve as timeline to trigger events in line
function bringInCards(duration=500, startscale= 0.0,endscale=1.0) {
  let start = performance.now();
    let a = false;
    let b = false;
    let c = false;

  function frame(now) {
    let time = Math.min((now - start) / duration, 1);
    let progress = getQuarticBezierPoint(time, [0,0],[0.25,0.25],[0.5,0.5],[0.75,0.75], [1.0,1.0])[1];
    let scale = startscale + (endscale - startscale) * progress;

    if(!a){
        animateScaleGeneral(card0);
        a = true;
    }
    if(time >= 0.33 && !b){
        animateScaleGeneral(card1);
        b = true;
    }

    if(time >= 0.66 && !c){
        animateScaleGeneral(card2);
        c = true;
    }

    if (time < 1) requestAnimationFrame(frame);
    else{
        diceImage.src = `assets/dice/dice${Math.floor(Math.random() * (6))}.png`
        animateScaleGeneral(diceImage);
        }
    }
    requestAnimationFrame(frame);
}

// #endregion
