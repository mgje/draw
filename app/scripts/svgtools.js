window.onload = function () {
    'use strict';

////---------- Globals ---------

var rvieleck = null,
    rtransformation = null,
    rkreise = null,
    ranimation = null,
    rkurve = null,
    rkurve2 = null,
    rdiagramm = null,
    rlogo = null,
    button = null,
    secondnav = null,
    tmpel = null,

////--------Regex    
    exprNL = new RegExp("\n","g"),
    exprNS1 = new RegExp("NS1:","g"),

//----------------------------
// Helper Function
move = function(fdx, fdy) {
    this.update( fdx - (this.dx || 0), fdy - (this.dy || 0));
    this.dx = fdx;
    this.dy = fdy;
},

up = function() {
    this.dx = this.dy = 0;
},
// update syntax highlighting
updateprettyprint = function(){
    PR.prettyPrint();
},
// Create Elmente in with namespace bla bla
createOn = function(el,name,attrs){
    var e = document.createElementNS(el.namespaceURI,name);      
    for (var lname in attrs) e.setAttribute(lname,attrs[lname]);
    el.appendChild(e);
    return e;
},
outerHTML = function(node){
    // if IE, Chrome take the internal method otherwise build one
  return node.outerHTML || (
      function(n){
          var div = document.createElement('div'), h;
          div.appendChild( n.cloneNode(true) );
          h = div.innerHTML;
          div = null;
          return h;
      })(node);
}, 
update_Kurve_SVG = function(r,id,idelment){
        var s = '<svg height="420" version="1.1" width="620" xmlns="http://www.w3.org/2000/svg">',
            n = r.getById(id).node;
        //n.removeAttributeNode(n.getAttributeNode("style"));
        s += S(outerHTML(n)).s;
        s += '</svg>';
        s = S(vkbeautify.xml(s)).escapeHTML().s;
        s = s.replace(exprNL,'<br>');
        tmpel = document.getElementById(idelment);
        tmpel.innerHTML=s;
        tmpel.className = "pre-wrap prettyprint";
        updateprettyprint();

},
update_NodeList_SVG = function(nodelist,idelment){
        var s = '<svg height="420" width="620" xmlns="http://www.w3.org/2000/svg" version="1.1">';
        for(var i = 0, num = nodelist.length; i < num; i+=1) {
            s += S(outerHTML(nodelist[i].node)).s;
        }
        s += '</svg>';
        s = S(vkbeautify.xml(s)).escapeHTML().s;
        s = s.replace(exprNL,'<br>');
        tmpel = document.getElementById(idelment);
        tmpel.innerHTML=s;
        tmpel.className = "pre-wrap prettyprint";
        updateprettyprint();

}, 
update_NodeList_SVG_xlink = function(nodelist,idelment){
        var s = '<svg height="420" width="620" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">';
        for(var i = 0, num = nodelist.length; i < num; i+=1) {
            s += S(outerHTML(nodelist[i].node)).s;
        }
        s += '</svg>';
        s = S(vkbeautify.xml(s,false)).escapeHTML().s;
        s = s.replace(exprNL,'<br>');
        s = s.replace(exprNS1,'xlink:');
        tmpel = document.getElementById(idelment);
        tmpel.innerHTML=s;
        tmpel.className = "pre-wrap prettyprint lang-html";
        updateprettyprint();
},     
//------------------------------------ SVG Kreis ---------------------------------
SVGKreis = function(opts) {
    var r = typeof(opts.r) === "object" ? opts.r : null,
        idname = typeof(opts.id) === "string" ? opts.id : null,
        x = typeof(opts.x) === "number" ? opts.x : null,
        y = typeof(opts.y) === "number" ? opts.y : null,
        discattr = {fill: "none","stroke-width": 4,stroke: "hsb(.9, .75, .75)"},
        discattr2 = {fill: "rgba(255, 255, 255,.5)", stroke: "none"},
        tmp = null,
        n_K = 20,
        r0 = -1,
        x0 = -1,
        y0 = -1,
        cir = null,
        s_n_K = "",
        list_cir= [],
        list_r=[],
        controls = null,
        circles = [];

    // Nutze breite des Elements
    x=document.getElementById("SVGKreis").offsetWidth;
    if (typeof(idname)==="string" && typeof(x)==="number" && typeof(y)==="number"){
        // r =  Raphael(idname, x, y);
        r = new Raphael(idname);
        r.setViewBox(0,0,x,y,false);
        // r.setSize('100%', '50%');
    } 

    var nodes = r.canvas.childNodes; 
   // Alles Löschen bis auf die ersten beiden
   while (nodes.length > 2){
    r.canvas.removeChild(nodes[2]);
   }

    // r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});

    s_n_K = document.getElementById("choose-AnzKreise").getAttribute("data-kreise");    
    // n_K = Number.parseInt(s_n_K); 
    n_K = parseInt(s_n_K); 

    var updatefunctioncenter = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y,
                YR = -circles[this.idnum].attr("r")+Y;
            this.attr({cx: X, cy: Y});
            circles[this.idnum].attr({cx: X, cy: Y});
            list_r[this.idnum].attr({cx: X, cy: YR});
            update_NodeList_SVG(circles,"SVGSourceKreis");
        };

    var updatefunctionradius =function (x, y) {
            var Y = this.attr("cy") + y,
                y0=circles[this.idnum].attr("cy"),
                r0=y0-Y;
            circles[this.idnum].attr({r:r0});
            this.attr({cy: Y});

            
            update_NodeList_SVG(circles,"SVGSourceKreis");
        };    

    if (x === null) {x = 300;}
    for(var i = 0; i < n_K; i+=1) {
        x0 = Math.round(Math.random()*x)+70;
        y0 = Math.round(Math.random()*300)+70;
        r0 = Math.round(Math.random()*70)+30;
        discattr.stroke="hsb("+i*0.05+0.3+", .75, .75)";
        tmp = r.circle(x0,y0, r0).attr(discattr);
        tmp.node.removeAttribute("style");
        circles.push(tmp);
        cir = r.circle(x0, y0,9).attr(discattr2);
        cir.idnum=i;
        list_cir.push(cir);

        cir.update = updatefunctioncenter;

        cir = r.circle(x0, y0-r0,9).attr(discattr2);
        cir.idnum=i;
        list_r.push(cir);
        cir.update= updatefunctionradius;
        
    }

    controls = r.set(list_cir);
    controls.drag(move, up);

    controls = r.set(list_r);
    controls.drag(move, up);

    update_NodeList_SVG(circles,"SVGSourceKreis");

    return (r); 

},
//------------------------------------ SVG Vieleck ---------------------------------
SVGVielEck = function(opts) {
    var r = typeof(opts.r) === "object" ? opts.r : null,
        idname = typeof(opts.id) === "string" ? opts.id : null,
        x = typeof(opts.x) === "number" ? opts.x : null,
         y = typeof(opts.y) === "number" ? opts.y : null,
        //y = window.innerWidth/2-100,
        data = [],
        discattr = {fill: "rgba(255, 255, 255,.5)", stroke: "none"},
        circles =[],
        curve = null,
        controls = null,
        num = 0,
        path = [];


    // Nutze Breite des Elements
    x=document.getElementById("SVGVieleck").offsetWidth;
    if (typeof(idname)==="string" && typeof(x)==="number" && typeof(y)==="number"){
        // r =  Raphael(idname, x, y);
        r = new Raphael(idname);
        r.setViewBox(0,0,x,y,false);
        //r.setSize('100%', '100%');
    } 

   var nodes = r.canvas.childNodes; 
   // Alles Löschen bis auf die ersten beiden
   while (nodes.length > 2){
    r.canvas.removeChild(nodes[2]);
   }

   // for(var i = 2, num = nodes.length; i < num; i+=1) {
   //      r.canvas.removeChild(nodes[i]);
   // }

   var s_anz = document.getElementById("choose-figure").getAttribute("data-ecken");    
   // var anz = Number.parseInt(s_anz); 
   var anz = parseInt(s_anz); 
  
   for(var i = 0; i < anz; i+=1) {
    var tmp = {};
    tmp.x = Math.round(200*Math.cos(2*Math.PI/anz*i)+300);
    tmp.y = Math.round(200*Math.sin(2*Math.PI/anz*i)+210);
    data.push(tmp);
   }
   

   // r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});

   for(i = 0, num = data.length; i < num; i+=1) {
        if (i === 0) {
            path.push('M');
        } else {
            path.push('L');
        }
        path.push(data[i].x);
        path.push(data[i].y);
   }
   path.push('Z');
   curve = r.path( path ).attr({"stroke": "hsb(.6, .75, .75)", "stroke-width": 4, "stroke-linecap": "round"});

   var updatefunction = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[this.idnum*3+1]=X;
            path[this.idnum*3+2]=Y;
            curve.attr({path: path});
            update_Kurve_SVG(r,curve.id,"SVGSourceVieleck");
        };

   for(i = 0, num = data.length; i < num; i+=1) {
        var cir = r.circle(data[i].x, data[i].y, 9).attr(discattr);
        circles.push(cir);
        cir.idnum=i;
        cir.update=updatefunction; 

   }

   controls = r.set(circles);

   controls.drag(move, up);
   
   // curve.node.removeAttributeNode(curve.node.getAttributeNode("style")); 
   curve.node.removeAttribute("style");          
   update_Kurve_SVG(r,curve.id,"SVGSourceVieleck");
   return (r);     
 },

// ---------------------------- Diagramm -------------------------
SVGDiagramm = function() {
    var  r = new Raphael("SVGDiagramm");

    // Nutze Breite des Elements
    var x=document.getElementById("SVGDiagramm").offsetWidth;
    r.setViewBox(0,0,x,420,false);
    // r.setSize('100%', '80%');

    var     data = [   {x: 50, y: 250}, {x: 100, y: 100},{x: 150, y: 150},
                    {x: 200, y: 140}, {x: 250, y: 250},{x: 300, y: 200},
                    {x: 350, y: 180}, {x: 400, y: 230} ],
         curve = null,
         path = ['M', data[0].x, data[0].y, 'R'],
         whiteattr = {fill: "#fff", stroke: "none"},
         plottedPoints = r.set();


    // r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});
    for(var i = 0, num = data.length; i < num; i+=1) {
       var point = data[i];
       plottedPoints.push(r.circle(point.x, point.y, 5));
    }
    plottedPoints.attr(whiteattr);

    for(i = 1, num = data.length; i < num; i+=1) {
       path.push(data[i].x);
       path.push(data[i].y);
   }
   curve = r.path( path ).attr({"stroke": "hsb(.6, .75, .75)", "stroke-width": 4, "stroke-linecap": "round"});
   curve.node.removeAttribute("style");
   
   update_Kurve_SVG(r,curve.id,"SVGSourceDiagramm");  
   return (r);  
 },

//----------------------------------- Kurve ----------------
SVGKurve = function(){
    // var r = Raphael("SVGKurve", 620, 420),

    var r = new Raphael("SVGKurve");
    // Nutze Breite des Elements
    var x=document.getElementById("SVGKurve").offsetWidth;  
    r.setViewBox(0,0,x,420,false);
        // r.setSize('100%', '80%');
    var discattr = {fill: "rgba(255, 255, 255,.5)", stroke: "none"};
    // r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});
    function curvef(x, y, ax, ay, bx, by, zx, zy, color) {
        var path = [["M", x, y], ["C", ax, ay, bx, by, zx, zy]],
            path2 = [["M", x, y], ["L", ax, ay], ["M", bx, by], ["L", zx, zy]],
            curve = r.path(path).attr({stroke: color || Raphael.getColor(),"stroke-width": 4, "stroke-linecap": "round"}),            
            controls = r.set(
                r.path(path2).attr({stroke: "#ccc", "stroke-dasharray": ". "}),
                r.circle(x, y, 9).attr(discattr),
                r.circle(ax, ay, 9).attr(discattr),
                r.circle(bx, by, 9).attr(discattr),
                r.circle(zx, zy, 9).attr(discattr)
            );
        // curve.node.removeAttributeNode(curve.node.getAttributeNode("style"));
        curve.node.removeAttribute("style");  
        update_Kurve_SVG(r,curve.id,"SVGSourceKurve");
        controls[1].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[0][1] = X;
            path[0][2] = Y;
            path2[0][1] = X;
            path2[0][2] = Y;
            controls[2].update(x, y);
            update_Kurve_SVG(r,curve.id,"SVGSourceKurve");
        };
        controls[2].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[1][1] = X;
            path[1][2] = Y;
            path2[1][1] = X;
            path2[1][2] = Y;
            curve.attr({path: path});
            controls[0].attr({path: path2});
            update_Kurve_SVG(r,curve.id,"SVGSourceKurve");
        };
        controls[3].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[1][3] = X;
            path[1][4] = Y;
            path2[2][1] = X;
            path2[2][2] = Y;
            curve.attr({path: path});
            controls[0].attr({path: path2});
            update_Kurve_SVG(r,curve.id,"SVGSourceKurve");
        };
        controls[4].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[1][5] = X;
            path[1][6] = Y;
            path2[3][1] = X;
            path2[3][2] = Y;
            controls[3].update(x, y);
            update_Kurve_SVG(r,curve.id,"SVGSourceKurve");

        };
        controls.drag(move, up);
    }
    curvef(70, 100, 261, 62, 237, 289, 486, 259, "hsb(0, .75, .75)");
    return (r); 
},
//--------------- SVGKurve2 ----------------------------------
SVGKurve2 = function(){
    // var r = Raphael("SVGKurve2", 620, 420),

    var r = new Raphael("SVGKurve2");
    var x=document.getElementById("SVGKurve2").offsetWidth; 
        r.setViewBox(0,0,x,420,false);
        // r.setSize('100%', '80%');

    var  discattr = {fill: "rgba(255, 255, 255,.5)", stroke: "none"};
    // r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});
    // r.text(310, 20, "Drag the points to change the curves").attr({fill: "#fff", "font-size": 16});
    function curvef(x, y, ax, ay, bx, by, zx, zy, a2x, a2y, b2x, b2y, z2x, z2y,color) {
        var path = [["M", x, y], ["C", ax, ay, bx, by, zx, zy, a2x, a2y, b2x, b2y, z2x, z2y]],
            path2 = [["M", x, y], ["L", ax, ay], ["M", bx, by], ["L", zx, zy], ["M", zx, zy], ["L", a2x, a2y], ["M", b2x, b2y], ["L", z2x, z2y]],
            curve = r.path(path).attr({stroke: color || Raphael.getColor(),"stroke-width": 4, "stroke-linecap": "round"}),      
            controls = r.set(
                r.path(path2).attr({stroke: "#ccc", "stroke-dasharray": ". "}),
                r.circle(x, y, 9).attr(discattr),
                r.circle(ax, ay, 9).attr(discattr),
                r.circle(bx, by, 9).attr(discattr),
                r.circle(zx, zy, 9).attr(discattr),
                r.circle(a2x, a2y, 9).attr(discattr),
                r.circle(b2x, b2y, 9).attr(discattr),
                r.circle(z2x, z2y, 9).attr(discattr)

            );
        // curve.node.removeAttributeNode(curve.node.getAttributeNode("style"));
        curve.node.removeAttribute("style");
        update_Kurve_SVG(r,curve.id,"SVGSourceKurve2");
        controls[1].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[0][1] = X;
            path[0][2] = Y;
            path2[0][1] = X;
            path2[0][2] = Y;
            controls[2].update(x, y);
            update_Kurve_SVG(r,curve.id,"SVGSourceKurve2");
        };
        controls[2].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[1][1] = X;
            path[1][2] = Y;
            path2[1][1] = X;
            path2[1][2] = Y;
            curve.attr({path: path});
            controls[0].attr({path: path2});
            update_Kurve_SVG(r,curve.id,"SVGSourceKurve2");
        };
        controls[3].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[1][3] = X;
            path[1][4] = Y;
            path2[2][1] = X;
            path2[2][2] = Y;
            curve.attr({path: path});
            controls[0].attr({path: path2});
            update_Kurve_SVG(r,curve.id,"SVGSourceKurve2");
        };
        controls[4].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[1][5] = X;
            path[1][6] = Y;
            path2[3][1] = X;
            path2[3][2] = Y;
            path2[4][1] = X;
            path2[4][2] = Y;
            controls[3].update(x, y);
            controls[5].update(x, y);
            update_Kurve_SVG(r,curve.id,"SVGSourceKurve2");

        };
        controls[5].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[1][7] = X;
            path[1][8] = Y;
            path2[5][1] = X;
            path2[5][2] = Y;
            curve.attr({path: path});
            controls[0].attr({path: path2});
            update_Kurve_SVG(r,curve.id,"SVGSourceKurve2");

        };
        controls[6].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[1][9] = X;
            path[1][10] = Y;
            path2[6][1] = X;
            path2[6][2] = Y;
            curve.attr({path: path});
            controls[0].attr({path: path2});
            update_Kurve_SVG(r,curve.id,"SVGSourceKurve2");

        };
        controls[7].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[1][11] = X;
            path[1][12] = Y;
            path2[7][1] = X;
            path2[7][2] = Y;
            controls[6].update(x, y);
            update_Kurve_SVG(r,curve.id,"SVGSourceKurve2");

        };
        controls.drag(move, up);
    }
  
    curvef(70, 100, 261, 62, 75, 349, 271, 220, 402, 122, 320,345, 470, 278, "hsb(.6, .75, .75)");
    return (r); 
},

// ----------------------------- Transformation ---------------------------------
SVGTransformation = function(opts) {
    var r = typeof(opts.r) === "object" ? opts.r : null,
        idname = typeof(opts.id) === "string" ? opts.id : null,
        x = typeof(opts.x) === "number" ? opts.x : null,
        y = typeof(opts.y) === "number" ? opts.y : null,
        trans = null,
        orig = null,
        copy = null,
        nodes = null,
        controls = null,
        x0 = 180,
        y0 = 110,
        dx = 166,
        dy = 205,
        discattr = {fill: "rgba(255, 255, 255,.5)", stroke: "none"},
        tmp = 0.0,
        objlist = [];

    x=document.getElementById("SVGTransformation").offsetWidth; 
    if (typeof(idname)==="string" && typeof(x)==="number" && typeof(y)==="number"){
        // r =  Raphael(idname, x, y);
        r = new Raphael(idname);
        r.setViewBox(0,0,x,y,false);
        // r.setSize('100%', '80%');
    } 
   nodes = r.canvas.childNodes; 
   // Alles Löschen bis auf die ersten beiden
   while (nodes.length > 2){
    r.canvas.removeChild(nodes[2]);
   }
   // r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});
   r.path([["M", 150, 360], ["L", 450, 360]]).attr({stroke: "#ccc", "stroke-dasharray": ". "});
   orig = r.image("images/biber.png",x0,y0,dx,dy);
   //orig = r.image("http://mgje.github.io/draw/images/biber.png",x0,y0,dx,dy);
   
   // orig.node.removeAttributeNode(orig.node.getAttributeNode("preserveAspectRatio"));
   orig.node.removeAttribute("preserveAspectRatio");
   trans = document.getElementById("choose-transformation").getAttribute("transformation");
   objlist.push(orig);

   if (trans !== "n"){
        copy = orig.clone();
        // copy.node.removeAttributeNode(copy.node.getAttributeNode("style"));
        // copy.node.removeAttributeNode(copy.node.getAttributeNode("preserveAspectRatio"));
        copy.node.removeAttribute("style");
        copy.node.removeAttribute("preserveAspectRatio");
        copy.transform(trans);
        objlist.push(copy);
   
        orig.attr({opacity:0.3});
    
    // Controls
        var res = trans.split(",");
                if (res[0][0] === "T"){
                    tmp = parseFloat(res[0].substring(1,res[0].length))/2+300;
                } else { 
                    if (res[0][0] === "R") {
                        tmp = parseFloat(res[0].substring(1,res[0].length))+300;
                    } else {
                        if (res[0][0] === "m") {
                            tmp = 0.13*150+300;
                        } else {
                            tmp = 300;
                        }
                    }
                }

        controls = r.set(
                r.circle(tmp, 360, 9).attr(discattr)
            );

        var transformation = document.getElementById("choose-transformation").getAttribute("transformation");
        controls[0].update = function (x, y) {
            var s = null,
                tf = null,
                X = null;
            // Verschiedene Controls
            if (trans[0] ==="T"){
                X = this.attr("cx") + x;
                if (X<450&&X>150){
                    this.attr({cx: X});
                }
                tf ="T"+((X-300)*2)+",0";
                copy.transform(tf);
                s = "Verschieben um "+((X-300)*2)+" Pixel";
                document.getElementById("message_trans").textContent=s;
            }
            if (trans[0] ==="R"){
                X = this.attr("cx") + x;
                if (X<450&&X>150){
                    this.attr({cx: X});
                }
                tf ="R"+(X-300);
                copy.transform(tf);
                s = "Drehen um "+(X-300)+" Grad";
                document.getElementById("message_trans").textContent=s;
            }

            if (trans.substring(0,2) === "S-"){
                X = this.attr("cx") + x;
                if (X<450&&X>150){
                    this.attr({cx: X});
                }

                tf ="S-1.0,1.0,T"+(X-300)+",0";
                copy.transform(tf);
                s = "Horizontal spiegeln an x="+(X-300);
                document.getElementById("message_trans").textContent=s;
            }

            if (trans.substring(0,2) === "S1"){
                X = this.attr("cx") + x;
                if (X<450&&X>150){
                    this.attr({cx: X});
                }
                tf ="S1.0,-1.0,T0,"+(X-300);
                copy.transform(tf);
                s = "Horizontal spiegeln an y="+(300-X);
                document.getElementById("message_trans").textContent=s;
            }

            if (trans.substring(0,9) === "m, 1, 0, "){
                X = this.attr("cx") + x;
                if (X<450&&X>150){
                    this.attr({cx: X});
                }
                tf ="m, 1, 0," +(X-300)/150+", 1, 0, 0";
                copy.transform(tf);
                s = "Verzerren um sx="+(300-X)/150;
                document.getElementById("message_trans").textContent=s;
            }

            if (trans.substring(0,9) === "m, 1, 0.1"){
                X = this.attr("cx") + x;
                if (X<450&&X>150){
                    this.attr({cx: X});
                }
                tf ="m, 1, " +(X-300)/150+",0, 1, 0, 0";
                copy.transform(tf);
                s = "Verzerren um sy="+(300-X)/150;
                document.getElementById("message_trans").textContent=s;
            }



            update_NodeList_SVG_xlink(objlist,"SVGSourceTransformation");
        };

        controls.drag(move, up);
    }    

  // orig.node.removeAttributeNode(orig.node.getAttributeNode("style"));
  orig.node.removeAttribute("style");
  update_NodeList_SVG_xlink(objlist,"SVGSourceTransformation");
  return (r); 
},
/// --------------------- ANIMATION -----------------------
/// ----------------------------------------------------
SVGAnimation = function(opts) {
    var r = typeof(opts.r) === "object" ? opts.r : null,
    idname = typeof(opts.id) === "string" ? opts.id : null,
    x = typeof(opts.x) === "number" ? opts.x : null,
    y = typeof(opts.y) === "number" ? opts.y : null,
    SObj = null,
    nodes = null,
    controls = null,
    discattr = {fill: "#fff", stroke: "none"},
    x0 = 70,
    y0 = 130,
    dx = 166,
    dy = 205,
    tmp = 0.0,
    dump = "",
    objlist = [];


    x=null;
    if (document.getElementById("SVGAnimation").offsetWidth !== null){
        x = document.getElementById("SVGAnimation").offsetWidth; 
    }
    
    if (typeof(idname)==="string" && typeof(x)==="number" && typeof(y)==="number"){
        // r =  Raphael(idname, x, y);
        r = new Raphael(idname);
        r.setViewBox(0,0,x,y,false);
        // r.setSize('100%', '80%');
    } 
   nodes = r.canvas.childNodes; 
   // Alles Löschen bis auf die ersten beiden
   while (nodes.length > 2){
    r.canvas.removeChild(nodes[2]);
   }
   // r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});
   
   SObj = r.image("images/biber.png",x0,y0,dx,dy);
   //SObj = r.image("http://mgje.github.io/draw/images/biber.png",x0,y0,dx,dy);
   // SObj.node.removeAttributeNode(SObj.node.getAttributeNode("style"));
   SObj.node.removeAttribute("style");

   dump = document.getElementById("ani_rechts").className;
   if (dump ==="selected"){  
       createOn(SObj.node,'animate',{
          attributeType:'XML', begin:'click',
          attributeName:'x', from: x0, to:'630',
          dur:'1.3s', fill:'freeze'
        });
    }

    dump = document.getElementById("ani_unten").className;
    if (dump ==="selected"){ 
       createOn(SObj.node,'animate',{
          attributeType:'XML', begin:'click',
          attributeName:'y', from: y0, to:'630',
          dur:'2.3s', fill:'freeze'
        });
    }
    dump = document.getElementById("ani_dicker").className;
    if (dump ==="selected"){ 
       createOn(SObj.node,'animate',{
          attributeType:'XML', begin:'click',
          attributeName:'width', from: dx, to:2.4*dx,
          dur:'3.3s', fill:'freeze'
        });
    }

    dump = document.getElementById("ani_kleiner").className;
    if (dump ==="selected"){ 
       createOn(SObj.node,'animate',{
          attributeType:'XML', begin:'click',
          attributeName:'height', from: dy, to:dy/3,
          dur:'3.3s', fill:'freeze'
        });
    }

    dump = document.getElementById("ani_rot").className;
    if (dump ==="selected"){ 

        createOn(SObj.node,'animateTransform',{
           begin:'click', attributeType:'XML',
          attributeName:'transform', type:'rotate', from: '0 153 232', to:'359.9 153 232',
          repeatCount: 'indefinite',
          additive: 'sum', dur:'3.3s', fill:'freeze'
        });
    }
      
    dump = document.getElementById("ani_pfad").className;
    if (dump ==="selected"){ 
         createOn(SObj.node,'animateMotion',{
            path: 'm-50,0 q150,150, 260,0 q150,-240 260,0',
            repeatCount: 'indefinite',
           begin:'click', dur:'2.3s', fill:'freeze'
        });
    }

   objlist.push(SObj);

   tmp = SObj.node.getAttribute("style");
   if (typeof(tmp)=== "string"){
        SObj.node.removeAttribute("style");
    }
   update_NodeList_SVG_xlink(objlist,"SVGSourceAnimation");
   return (r); 
},
/// --------------------- LOGO   -----------------------
/// ----------------------------------------------------
SVGLogo = function(opts) {
    var r = typeof(opts.r) === "object" ? opts.r : null,
        idname = typeof(opts.id) === "string" ? opts.id : null,
        x = typeof(opts.x) === "number" ? opts.x : null,
        y = typeof(opts.y) === "number" ? opts.y : null,
        lSet = null,
        nodes = null,
        controls = null,
        discattr = {fill: "#fff", stroke: "none"},
        x0 = 70,
        y0 = 130,
        dx = 166,
        dy = 205,
        tmp = 0.0,
        dump = "",
        objlist = [];

    x=document.getElementById("SVGLogo").offsetWidth; 
    if (typeof(idname)==="string" && typeof(x)==="number" && typeof(y)==="number"){
        // r =  Raphael(idname, x, y);
        r = new Raphael(idname);
        r.setViewBox(0,0,x,y,false);
        // r.setSize('100%', '80%');
    } 
   nodes = r.canvas.childNodes; 
   // Alles Löschen bis auf die ersten beiden
   while (nodes.length > 2){
    r.canvas.removeChild(nodes[2]);
   }
   // r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});
   
   var kreis = r.circle(299, 422, 78).attr({fill: '#481300','stroke-width': '0'});
   var zahn_u_m =r.path("M298,464.2c-7.6,0-13.9,6.3-13.9,13.9l0,14.1H312l0-14.2C311.9,470.4,305.7,464.2,298,464.2z").attr({fill: '#FFFFFF',stroke: "none"});
   var zahn_u_l =r.path("M259.5,458.7c-7.1,0-13.1,5.5-13.8,12.4l27.7,20.2l0-18.7C273.4,464.9,267.2,458.7,259.5,458.7z").attr({fill: '#FFFFFF',stroke: "none"});
   var zahn_u_r =r.path("M336.5,456.3c-7.6,0-13.9,6.3-13.9,13.9l0,20.5l27.8-20.2l0-0.4C350.4,462.5,344.2,456.3,336.5,456.3z").attr({fill: '#FFFFFF',stroke: "none"});

   var zahn_o_m =r.path("M298.1,388.8L298.1,388.8c7.6,0,13.9-6.3,13.9-13.9l0-23.1h-27.8l0,23.1C284.2,382.6,290.4,388.8,298.1,388.8z").attr({fill: '#FFFFFF',stroke: "none"});
   var zahn_o_l =r.path("M336.6,387.1L336.6,387.1c7.5,0,13.7-6.1,13.9-13.6l-27.8-20.2l0,19.9C322.6,380.9,328.9,387.1,336.6,387.1z").attr({fill: '#FFFFFF',stroke: "none"});
   var zahn_o_r =r.path("M259.6,383.5L259.6,383.5c7.6,0,13.9-6.3,13.9-13.9l0-16.7L246,372.7C247.5,378.9,253,383.5,259.6,383.5z").attr({fill: '#FFFFFF',stroke: "none"});

   var rand =r.path("M382.6,360.3l-52.5-38.1h-64.9l-52.5,38.1l-20,61.7l20,61.7l52.5,38.1h64.9l52.5-38.1l20-61.7L382.6,360.3z M350.4,470.5l-27.8,20.2l-2.1,1.6H312h-27.8h-9.3l-1.4-1l-27.7-20.2l-7.8-5.7L223.8,422l14.1-43.4l8.1-5.9l27.4-19.9l1.4-1h9.3h27.8h8.6l2.1,1.5l27.8,20.2l7,5.1l14.1,43.4l-14.1,43.4L350.4,470.5z").attr({fill: '#D55734',stroke: "none"});
   var b1_b =r.path("M251.5,431.2c0,7.3-5.4,12.1-15.2,12.1H209v-10.5h4.1v-21.7H209v-10.4h25.6c9.4,0,15,4.6,15,11.4c0,3.7-1.9,8-5.8,9.5C248.7,422.7,251.5,427,251.5,431.2z M226.2,417.7h5.7c3,0,4.6-1.4,4.6-3.5c0-2.3-1.6-3.3-4.6-3.3h-5.6V417.7z M233.2,433.1c3.5,0,5-1.3,5-3.6c0-2.1-1.3-3.2-4.8-3.2h-7.2v6.8H233.2z").attr({fill: '#FFFFFF',stroke: "none"});
   var b2_y =r.path("M283.5,432.9h5.6v10.5h-24.4v-10.5h5.6V432l-11.3-20.9h-6.1v-10.4h21.7v10.4h-1.1l3.3,6.1l3.3-6.1h-1v-10.4h21.7v10.4h-6L283.5,432V432.9z").attr({fill: '#FFFFFF',stroke: "none"});
   var b3_t =r.path("M345.6,417.6h-10.5v-5.5H331v20.8h6.5v10.5h-26v-10.5h6.5v-20.8h-4.2v5.5h-10.5v-16.8h42.4V417.6z").attr({fill: '#FFFFFF',stroke: "none"});
   var b4_e =r.path("M386,415.3h-10.5v-3.6h-9.7v5.4h14.1v10h-14.1v5.4h9.7v-3.6H386v14.5h-37.3v-10.5h4.1v-21.7h-4.1v-10.4H386V415.3z").attr({fill: '#FFFFFF',stroke: "none"});

   lSet = r.set();
   lSet.push(kreis);
   lSet.push(zahn_u_m);
   lSet.push(zahn_u_l);
   lSet.push(zahn_u_r);

   lSet.push(zahn_o_m);
   lSet.push(zahn_o_l);
   lSet.push(zahn_o_r);

   lSet.push(rand);

   lSet.push(b1_b);
   lSet.push(b2_y);
   lSet.push(b3_t);
   lSet.push(b4_e);

   lSet.translate(60,-200);

   //SObj = r.image("http://mgje.github.io/draw/images/biber.png",x0,y0,dx,dy);
   // SObj.node.removeAttributeNode(SObj.node.getAttributeNode("style"));
   //SObj.node.removeAttribute("style");

   // dump = document.getElementById("ani_rechts").className;
   // if (dump ==="selected"){  
   //     createOn(SObj.node,'animate',{
   //        attributeType:'XML', begin:'click',
   //        attributeName:'x', from: x0, to:'630',
   //        dur:'1.3s', fill:'freeze'
   //      });
   //  }

   //  dump = document.getElementById("ani_unten").className;
   //  if (dump ==="selected"){ 
   //     createOn(SObj.node,'animate',{
   //        attributeType:'XML', begin:'click',
   //        attributeName:'y', from: y0, to:'630',
   //        dur:'2.3s', fill:'freeze'
   //      });
   //  }
   //  dump = document.getElementById("ani_dicker").className;
   //  if (dump ==="selected"){ 
   //     createOn(SObj.node,'animate',{
   //        attributeType:'XML', begin:'click',
   //        attributeName:'width', from: dx, to:2.4*dx,
   //        dur:'3.3s', fill:'freeze'
   //      });
   //  }

   //  dump = document.getElementById("ani_kleiner").className;
   //  if (dump ==="selected"){ 
   //     createOn(SObj.node,'animate',{
   //        attributeType:'XML', begin:'click',
   //        attributeName:'height', from: dy, to:dy/3,
   //        dur:'3.3s', fill:'freeze'
   //      });
   //  }

   //  dump = document.getElementById("ani_rot").className;
   //  if (dump ==="selected"){ 

   //      createOn(SObj.node,'animateTransform',{
   //         begin:'click', attributeType:'XML',
   //        attributeName:'transform', type:'rotate', from: '0 153 232', to:'359.9 153 232',
   //        repeatCount: 'indefinite',
   //        additive: 'sum', dur:'3.3s', fill:'freeze'
   //      });
   //  }
      
   //  dump = document.getElementById("ani_pfad").className;
   //  if (dump ==="selected"){ 
   //       createOn(SObj.node,'animateMotion',{
   //          path: 'm-50,0 q150,150, 260,0 q150,-240 260,0',
   //          repeatCount: 'indefinite',
   //         begin:'click', dur:'2.3s', fill:'freeze'
   //      });
   //  }

   //objlist.push(SObj);

   // tmp = SObj.node.getAttribute("style");
   // if (typeof(tmp)=== "string"){
   //      SObj.node.removeAttribute("style");
   //  }

   for(var j = 0; j < lSet.length; j++) {
        tmp= lSet[j].node.getAttribute("style");
        if (typeof(tmp)=== "string"){
           lSet[j].node.removeAttribute("style");
        }
    }
   update_NodeList_SVG_xlink(lSet,"SVGSourceLogo");
   return (r); 
},



// ----------------------------------------------------------------------------
// Callback Functions for Buttons

buttonActionanimation=function(event){
    if ( event.preventDefault ) { event.preventDefault();}
    event.returnValue = false;  
    var content = document.getElementById("SVGSourceAnimation").textContent;

    var uriContent = "data:image/svg+xml," + encodeURIComponent(content);
    var newWindow=window.open(uriContent, 'animation.svg');
},

buttonActiontransformation=function (event){
    if ( event.preventDefault ) { event.preventDefault();}  
    event.returnValue = false;  
    var content = document.getElementById("SVGSourceTransformation").textContent;

    var uriContent = "data:image/svg+xml," + encodeURIComponent(content);
    var newWindow=window.open(uriContent, 'transformation.svg');
},

buttonActionkreis= function(event){
    if ( event.preventDefault ) { event.preventDefault();}  
    event.returnValue = false;  
    var content = document.getElementById("SVGSourceKreis").textContent;

    var uriContent = "data:image/svg+xml," + encodeURIComponent(content);
    var newWindow=window.open(uriContent, 'kreis.svg');
},

buttonActionvieleck= function(event){
    if ( event.preventDefault ) { event.preventDefault();}  
    event.returnValue = false;  
    var content = '<svg height="420" version="1.1" width="620" xmlns="http://www.w3.org/2000/svg">';
        content += outerHTML(document.getElementById("SVGVieleck").getElementsByTagName("path")[0]);
        content += '</svg>';
    var uriContent = "data:image/svg+xml," + encodeURIComponent(content);
    var newWindow=window.open(uriContent, 'vieleck.svg');
},

buttonActionkurve2= function(event){
    if ( event.preventDefault ) { event.preventDefault();}  
    event.returnValue = false;  
    var content = '<svg height="420" version="1.1" width="620" xmlns="http://www.w3.org/2000/svg">';
        content += outerHTML(document.getElementById("SVGKurve2").getElementsByTagName("path")[0]);
        content += '</svg>';
    var uriContent = "data:image/svg+xml," + encodeURIComponent(content);
    var newWindow=window.open(uriContent, 'kurve2.svg');
},

buttonActionkurve= function(event){
    if ( event.preventDefault ) { event.preventDefault();}  
    event.returnValue = false;  
    var content = '<svg height="420" version="1.1" width="620" xmlns="http://www.w3.org/2000/svg">';
        content += outerHTML(document.getElementById("SVGKurve").getElementsByTagName("path")[0]);
        content += '</svg>';
    var uriContent = "data:image/svg+xml," + encodeURIComponent(content);
    var newWindow=window.open(uriContent, 'kurve.svg');
},


buttonActionvideo=function(event){
    if ( event.preventDefault ) { event.preventDefault();}  
    event.returnValue = false;  
       var video = document.getElementById("video1");
       var button = document.getElementById("buttonvideo");
       if (video.paused) {
          video.play();
          button.textContent = "||  Pause";
       } else {
          video.pause();
          button.textContent = "> Start";
       }
    
},

secondNavAction=function(event){
    var alist = event.currentTarget.getElementsByTagName("a");
    
    for(var i = 0, num = alist.length; i < num; i+=1) {
        if (alist[i].className === "selected"){
            alist[i].className="";
            break;  // breaks out of loop completely
        }
    }
    event.target.className="selected";
    event.currentTarget.setAttribute("data-ecken",event.target.getAttribute("anz-ecken"));
    // SVGVielEck("SVGVieleck",620,420);
    rvieleck = new SVGVielEck({r:rvieleck});
    
},

secondNavActionKreise=function(event){
    if (event.target.tagName === "A"){
        var alist = event.currentTarget.getElementsByTagName("a");
        
        for(var i = 0, num = alist.length; i < num; i+=1) {
            if (alist[i].className === "selected"){
                alist[i].className="";
                break;  // breaks out of loop completely
            }
        }
        event.target.className="selected";
        event.currentTarget.setAttribute("data-kreise",event.target.getAttribute("anz-kreis"));
        rkreise = new SVGKreis({r:rkreise});

    }
},

secondNavActionTransformation=function(event){
    if (event.target.tagName === "A"){

        var alist = event.currentTarget.getElementsByTagName("a");
        
        for(var i = 0, num = alist.length; i < num; i+=1) {
            if (alist[i].className === "selected"){
                alist[i].className="";
                break;  // breaks out of loop completely
            }
        }
        event.target.className="selected";
        event.currentTarget.setAttribute("transformation",event.target.getAttribute("matrix"));
        document.getElementById("message_trans").textContent=event.target.getAttribute("message");

        rtransformation = new SVGTransformation({r:rtransformation});
        
    }
},

secondNavActionAnimation=function(event){
    var alist = event.currentTarget.getElementsByTagName("a");
    
 
    if (event.target.className==="selected"){
        event.target.className="";
    } else {
        event.target.className="selected";
    }

    ranimation = new SVGAnimation({r:ranimation});
    
};

// Main Program start hier
    
    rkreise = new SVGKreis({id:"SVGKreis",x:620,y:420});
    rvieleck = new SVGVielEck({id:"SVGVieleck",x:620,y:420});
    rkurve = new SVGKurve();
    rkurve2 = new SVGKurve2();
    rtransformation = new SVGTransformation({id:"SVGTransformation",x:620,y:420});
    ranimation = new SVGAnimation({id:"SVGAnimation",x:620,y:420});
    rdiagramm = new SVGDiagramm();
    rlogo = new SVGLogo({id:"SVGLogo",x:620,y:420});
    
    
    //Register Buttons
    button = document.getElementById("buttonanimation");
    if (button !== null){
        if(button.addEventListener){
                 button.addEventListener("click", buttonActionanimation);
        } else {
                 button.attachEvent("click", buttonActionanimation);
        }
    }

    button = document.getElementById("buttontransformation");
    if (button !== null){
        if(button.addEventListener){
                 button.addEventListener("click", buttonActiontransformation);
        } else {
                 button.attachEvent("click", buttonActiontransformation);
        }
    }

    button = document.getElementById("buttonkreis");
    if (button !== null){
        if(button.addEventListener){
                 button.addEventListener("click", buttonActionkreis);
        } else {
                 button.attachEvent("click", buttonActionkreis);
        }
    }

    button = document.getElementById("buttonvieleck");
    if (button !== null){
        if(button.addEventListener){
                 button.addEventListener("click", buttonActionvieleck);
        } else {
                 button.attachEvent("click", buttonActionvieleck);
        }
    }

    button = document.getElementById("buttonkurve2");
    if (button !== null){
        if(button.addEventListener){
                 button.addEventListener("click", buttonActionkurve2);
        } else {
                 button.attachEvent("click", buttonActionkurve2);
        }
    }


    button = document.getElementById("buttonkurve1");
    if (button !== null){
        if(button.addEventListener){
                 button.addEventListener("click", buttonActionkurve);
        } else {
                 button.attachEvent("click", buttonActionkurve);
        }
    }

    button = document.getElementById("buttonvideo");
    if (button !== null){
        if(button.addEventListener){
                 button.addEventListener("click", buttonActionvideo);
        } else {
                 button.attachEvent("click", buttonActionvideo);
        }
    }

    secondnav = document.getElementById("choose-figure");
    if (secondnav !== null){
        if(secondnav.addEventListener){
                 secondnav.addEventListener("click", secondNavAction);
        } else {
                 secondnav.attachEvent("click", secondNavAction);
        }
    }

    secondnav = document.getElementById("choose-AnzKreise");
    if (secondnav !== null){
        if(secondnav.addEventListener){
                 secondnav.addEventListener("click", secondNavActionKreise);
        } else {
                 secondnav.attachEvent("click", secondNavActionKreise);
        }
    }

    secondnav = document.getElementById("choose-transformation");
    if (secondnav !== null){
        if(secondnav.addEventListener){
                 secondnav.addEventListener("click", secondNavActionTransformation);
        } else {
                 secondnav.attachEvent("click", secondNavActionTransformation);
        }
    }

    secondnav = document.getElementById("choose-animation");
    if (secondnav !== null){
        if(secondnav.addEventListener){
                 secondnav.addEventListener("click", secondNavActionAnimation);
        } else {
                 secondnav.attachEvent("click", secondNavActionAnimation);
        }
    }

};