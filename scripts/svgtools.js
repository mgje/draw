////---------- Globals ---------

var rvieleck = null,
    rtransformation = null,
    rkreise = null,
    ranimation = null;

//----------------------------
// Helper Function
function move(dx, dy) {
    this.update(dx - (this.dx || 0), dy - (this.dy || 0));
    this.dx = dx;
    this.dy = dy;
}

function up() {
    this.dx = this.dy = 0;
}


// Create Elmente in with namespace bla bla
function createOn(el,name,attrs){
    var e = document.createElementNS(el.namespaceURI,name);      
    for (var name in attrs) e.setAttribute(name,attrs[name]);
    el.appendChild(e);
    return e;
}


function outerHTML(node){
    // if IE, Chrome take the internal method otherwise build one
  return node.outerHTML || (
      function(n){
          var div = document.createElement('div'), h;
          div.appendChild( n.cloneNode(true) );
          h = div.innerHTML;
          div = null;
          return h;
      })(node);
  } 

 function update_Kurve_SVG(r,id,idelment){
        var s = S('<svg height="420" version="1.1" width="620" xmlns="http://www.w3.org/2000/svg">').escapeHTML().s,
            n = r.getById(id).node;
        //n.removeAttributeNode(n.getAttributeNode("style"));
        s += S(outerHTML(n)).escapeHTML().s;
        s += S('</svg>' ).escapeHTML().s;
        document.getElementById(idelment).innerHTML=s;
    }

function update_NodeList_SVG(nodelist,idelment){
        var s = S('<svg height="420" width="620" xmlns="http://www.w3.org/2000/svg" version="1.1">').escapeHTML().s;
        for(var i = 0, num = nodelist.length; i < num; i+=1) {
            s += S(outerHTML(nodelist[i].node)).escapeHTML().s;
        }
        s += S('</svg>' ).escapeHTML().s;
        document.getElementById(idelment).innerHTML=s;
    } 
function update_NodeList_SVG_xlink(nodelist,idelment){
        var s = S('<svg height="420" width="620" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">').escapeHTML().s;
        for(var i = 0, num = nodelist.length; i < num; i+=1) {
            s += S(outerHTML(nodelist[i].node)).escapeHTML().s;
        }
        s += S('</svg>' ).escapeHTML().s;
        document.getElementById(idelment).innerHTML=s;
    }     

//------------------------------------ SVG Kreis ---------------------------------

function SVGKreis(opts) {
    var r = typeof(opts.r) === "object" ? opts.r : null,
        idname = typeof(opts.id) === "string" ? opts.id : null,
        x = typeof(opts.x) === "number" ? opts.x : null,
        y = typeof(opts.y) === "number" ? opts.y : null,
        discattr = {fill: "none","stroke-width": 4,stroke: "hsb(.9, .75, .75)"},
        discattr2 = {fill: "#fff", stroke: "none"},
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

    if (typeof(idname)==="string" && typeof(x)==="number" && typeof(y)==="number"){
        r =  Raphael(idname, x, y);
    } 

    var nodes = r.canvas.childNodes; 
   // Alles Löschen bis auf die ersten beiden
   while (nodes.length > 2){
    r.canvas.removeChild(nodes[2]);
   }

    r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});

    s_n_K = document.getElementById("choose-AnzKreise").getAttribute("data-kreise");    
    n_K = Number.parseInt(s_n_K); 

    for(var i = 0; i < n_K; i+=1) {
        x0 = Math.round(Math.random()*300)+150;
        y0 = Math.round(Math.random()*300)+70;
        r0 = Math.round(Math.random()*70)+30;
        discattr.stroke="hsb("+i*0.05+0.3+", .75, .75)";
        tmp = r.circle(x0,y0, r0).attr(discattr);
        tmp.node.removeAttributeNode(tmp.node.getAttributeNode("style"));
        circles.push(tmp);
        cir = r.circle(x0, y0,5).attr(discattr2);
        cir.idnum=i;
        list_cir.push(cir);
        cir.update=function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y,
                YR = -circles[this.idnum].attr("r")+Y;
            this.attr({cx: X, cy: Y});
            circles[this.idnum].attr({cx: X, cy: Y});
            list_r[this.idnum].attr({cx: X, cy: YR});
            update_NodeList_SVG(circles,"SVGSourceKreis");
        };

        cir = r.circle(x0, y0-r0,5).attr(discattr2);
        cir.idnum=i;
        list_r.push(cir);
        cir.update=function (x, y) {
            var Y = this.attr("cy") + y,
            y0=circles[this.idnum].attr("cy"),
            r0=y0-Y;
            circles[this.idnum].attr({r:r0})
            this.attr({cy: Y});

            
            update_NodeList_SVG(circles,"SVGSourceKreis");
        };
        
    }

    controls = r.set(list_cir);
    controls.drag(move, up);

    controls = r.set(list_r);
    controls.drag(move, up);

    update_NodeList_SVG(circles,"SVGSourceKreis");
    return (r) 

}
//------------------------------------ SVG Vieleck ---------------------------------
  function SVGVielEck(opts) {
    var r = typeof(opts.r) === "object" ? opts.r : null,
        idname = typeof(opts.id) === "string" ? opts.id : null,
        x = typeof(opts.x) === "number" ? opts.x : null,
        y = typeof(opts.y) === "number" ? opts.y : null,
        data = [],
        discattr = {fill: "#fff", stroke: "none"},
        circles =[],
        curve = null,
        controls = null,
        path = [];

    if (typeof(idname)==="string" && typeof(x)==="number" && typeof(y)==="number"){
        r =  Raphael(idname, x, y);
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
   var anz = Number.parseInt(s_anz); 
  
   for(var i = 0; i < anz; i+=1) {
    var tmp = {};
    tmp.x = Math.round(200*Math.cos(2*Math.PI/anz*i)+300);
    tmp.y = Math.round(200*Math.sin(2*Math.PI/anz*i)+210);
    data.push(tmp);
   }
   

   r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});

   for(var i = 0, num = data.length; i < num; i+=1) {
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

   for(var i = 0, num = data.length; i < num; i+=1) {
        var cir = r.circle(data[i].x, data[i].y, 5).attr(discattr);
        circles.push(cir);
        cir.idnum=i;
        cir.update=function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[this.idnum*3+1]=X;
            path[this.idnum*3+2]=Y;
            curve.attr({path: path});
            update_Kurve_SVG(r,curve.id,"SVGSourceVieleck");
        };

   }

   controls = r.set(circles);

   controls.drag(move, up);
                
   update_Kurve_SVG(r,curve.id,"SVGSourceVieleck");
   return (r)     
 }

// ---------------------------- Diagramm -------------------------

 function SVGDiagramm() {
    var r = Raphael("SVGDiagramm", 620, 420),
         data = [   {x: 50, y: 250}, {x: 100, y: 100},{x: 150, y: 150},
                    {x: 200, y: 140}, {x: 250, y: 250},{x: 300, y: 200},
                    {x: 350, y: 180}, {x: 400, y: 230} ],
         curve = null;
         path = ['M', data[0].x, data[0].y, 'R'],
         whiteattr = {fill: "#fff", stroke: "none"},
         plottedPoints = r.set();

    r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});
    for(var i = 0, num = data.length; i < num; i+=1) {
       var point = data[i];
       plottedPoints.push(r.circle(point.x, point.y, 5));
    }
    plottedPoints.attr(whiteattr);

    for(var i = 1, num = data.length; i < num; i+=1) {
       path.push(data[i].x);
       path.push(data[i].y);
   }
   curve = r.path( path ).attr({"stroke": "hsb(.6, .75, .75)", "stroke-width": 4, "stroke-linecap": "round"});
   curve.node.removeAttributeNode(curve.node.getAttributeNode("style"));
   
   update_Kurve_SVG(r,curve.id,"SVGSourceDiagramm");   
 }

//----------------------------------- Kurve ----------------

 function SVGKurve(){
    var r = Raphael("SVGKurve", 620, 420),
        discattr = {fill: "#fff", stroke: "none"};
    r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});
    
    function curve(x, y, ax, ay, bx, by, zx, zy, color) {
        var path = [["M", x, y], ["C", ax, ay, bx, by, zx, zy]],
            path2 = [["M", x, y], ["L", ax, ay], ["M", bx, by], ["L", zx, zy]],
            curve = r.path(path).attr({stroke: color || Raphael.getColor(),"stroke-width": 4, "stroke-linecap": "round"}),            
            controls = r.set(
                r.path(path2).attr({stroke: "#ccc", "stroke-dasharray": ". "}),
                r.circle(x, y, 5).attr(discattr),
                r.circle(ax, ay, 5).attr(discattr),
                r.circle(bx, by, 5).attr(discattr),
                r.circle(zx, zy, 5).attr(discattr)
            );
        curve.node.removeAttributeNode(curve.node.getAttributeNode("style"));
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


    curve(70, 100, 261, 62, 237, 289, 486, 259, "hsb(0, .75, .75)");
    // curve(170, 100, 210, 100, 230, 200, 270, 200, "hsb(.8, .75, .75)");
    // curve(270, 100, 310, 100, 330, 200, 370, 200, "hsb(.3, .75, .75)");
    // curve(370, 100, 410, 100, 430, 200, 470, 200, "hsb(.6, .75, .75)");
    // curve(470, 100, 510, 100, 530, 200, 570, 200, "hsb(.1, .75, .75)");

    //var ss = document.getElementById("SVGKurve").innerHTML;
    //document.getElementById("SVGSourceKurve").innerHTML=S(r.getById(2).node.outerHTML).escapeHTML().s;
}
//--------------- SVGKurve2 ----------------------------------
function SVGKurve2(){
    var r = Raphael("SVGKurve2", 620, 420),
        discattr = {fill: "#fff", stroke: "none"};
    r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});
    // r.text(310, 20, "Drag the points to change the curves").attr({fill: "#fff", "font-size": 16});
    

    function curve(x, y, ax, ay, bx, by, zx, zy, a2x, a2y, b2x, b2y, z2x, z2y,color) {
        var path = [["M", x, y], ["C", ax, ay, bx, by, zx, zy, a2x, a2y, b2x, b2y, z2x, z2y]],
            path2 = [["M", x, y], ["L", ax, ay], ["M", bx, by], ["L", zx, zy], ["M", zx, zy], ["L", a2x, a2y], ["M", b2x, b2y], ["L", z2x, z2y]],
            curve = r.path(path).attr({stroke: color || Raphael.getColor(),"stroke-width": 4, "stroke-linecap": "round"}),      
            controls = r.set(
                r.path(path2).attr({stroke: "#ccc", "stroke-dasharray": ". "}),
                r.circle(x, y, 5).attr(discattr),
                r.circle(ax, ay, 5).attr(discattr),
                r.circle(bx, by, 5).attr(discattr),
                r.circle(zx, zy, 5).attr(discattr),
                r.circle(a2x, a2y, 5).attr(discattr),
                r.circle(b2x, b2y, 5).attr(discattr),
                r.circle(z2x, z2y, 5).attr(discattr)

            );
        curve.node.removeAttributeNode(curve.node.getAttributeNode("style"));
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
    // function move(dx, dy) {
    //     this.update(dx - (this.dx || 0), dy - (this.dy || 0));
    //     this.dx = dx;
    //     this.dy = dy;
    // }
    // function up() {
    //     this.dx = this.dy = 0;
    // }

    curve(70, 100, 261, 62, 75, 349, 271, 220, 402, 122, 320,345, 470, 278, "hsb(.6, .75, .75)");
    // curve(170, 100, 210, 100, 230, 200, 270, 200, "hsb(.8, .75, .75)");
    // curve(270, 100, 310, 100, 330, 200, 370, 200, "hsb(.3, .75, .75)");
    // curve(370, 100, 410, 100, 430, 200, 470, 200, "hsb(.6, .75, .75)");
    // curve(470, 100, 510, 100, 530, 200, 570, 200, "hsb(.1, .75, .75)");

    //var ss = document.getElementById("SVGKurve").innerHTML;
    //document.getElementById("SVGSourceKurve").innerHTML=S(r.getById(2).node.outerHTML).escapeHTML().s;
}

// ----------------------------- Transformation ---------------------------------
function SVGTransformation(opts) {
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
        discattr = {fill: "#fff", stroke: "none"},
        tmp = 0.0,
        objlist = [];

    if (typeof(idname)==="string" && typeof(x)==="number" && typeof(y)==="number"){
        r =  Raphael(idname, x, y);
    } 
   
   nodes = r.canvas.childNodes; 
   // Alles Löschen bis auf die ersten beiden
   while (nodes.length > 2){
    r.canvas.removeChild(nodes[2]);
   }
   r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});
   r.path([["M", 150, 360], ["L", 450, 360]]).attr({stroke: "#ccc", "stroke-dasharray": ". "});
   orig = r.image("http://mgje.github.io/draw/images/biber.png",x0,y0,dx,dy);
   
   orig.node.removeAttributeNode(orig.node.getAttributeNode("preserveAspectRatio"));
   trans = document.getElementById("choose-transformation").getAttribute("transformation");
   objlist.push(orig);

   if (trans !== "n"){
        copy = orig.clone();
        copy.node.removeAttributeNode(copy.node.getAttributeNode("style"));
        copy.node.removeAttributeNode(copy.node.getAttributeNode("preserveAspectRatio"));
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
                r.circle(tmp, 360, 5).attr(discattr)
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
                s = "horizontal Spiegeln an x="+(X-300);
                document.getElementById("message_trans").textContent=s;
            }

            if (trans.substring(0,2) === "S1"){
                X = this.attr("cx") + x;
                if (X<450&&X>150){
                    this.attr({cx: X});
                }
                tf ="S1.0,-1.0,T0,"+(X-300);
                copy.transform(tf);
                s = "horizontal Spiegeln an y="+(300-X);
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




  orig.node.removeAttributeNode(orig.node.getAttributeNode("style"));
  update_NodeList_SVG_xlink(objlist,"SVGSourceTransformation");
  return (r) 
}
/// --------------------- ANIMATION -----------------------
/// ----------------------------------------------------
function SVGAnimation(opts) {
    var r = typeof(opts.r) === "object" ? opts.r : null,
        idname = typeof(opts.id) === "string" ? opts.id : null,
        x = typeof(opts.x) === "number" ? opts.x : null,
        y = typeof(opts.y) === "number" ? opts.y : null,
        SObj = null,
        nodes = null,
        controls = null,
        discattr = {fill: "#fff", stroke: "none"},
        x0 = 80,
        y0 = 110,
        dx = 166,
        dy = 205,
        tmp = 0.0,
        objlist = [];

    if (typeof(idname)==="string" && typeof(x)==="number" && typeof(y)==="number"){
        r =  Raphael(idname, x, y);
    } 
   
   nodes = r.canvas.childNodes; 
   // Alles Löschen bis auf die ersten beiden
   while (nodes.length > 2){
    r.canvas.removeChild(nodes[2]);
   }
   r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});
   
   
   SObj = r.image("http://mgje.github.io/draw/images/biber.png",x0,y0,dx,dy);
   
   // createOn(SObj.node,'animate',{
   //    attributeType:'XML', begin:'click',
   //    attributeName:'x', from: x0, to:'630',
   //    dur:'1.3s', fill:'freeze'
   //  });

   // createOn(SObj.node,'animate',{
   //    attributeType:'XML', begin:'click',
   //    attributeName:'y', from: y0, to:'630',
   //    dur:'3.3s', fill:'freeze'
   //  });

   // createOn(SObj.node,'animate',{
   //    attributeType:'XML', begin:'click',
   //    attributeName:'width', from: dx, to:2*dx,
   //    dur:'3.3s', fill:'freeze'
   //  });

   // createOn(SObj.node,'animate',{
   //    attributeType:'XML', begin:'click',
   //    attributeName:'height', from: dy, to:dy/2,
   //    dur:'2.3s', fill:'freeze'
   //  });

   // createOn(SObj.node,'animateTransform',{
   //     begin:'click', attributeType:'XML',
   //    attributeName:'transform', type:'scale', from: '1', to:'4',
   //    dur:'3.3s', fill:'freeze'
   //  });

    // createOn(SObj.node,'animateTransform',{
    //    begin:'click', attributeType:'XML',
    //   attributeName:'transform', type:'scale', from: '1', to:'4 2',
    //   additive: 'sum', dur:'3.3s', fill:'freeze'
    // });

    createOn(SObj.node,'animateTransform',{
       begin:'click', attributeType:'XML',
      attributeName:'transform', type:'rotate', from: '0', to:'180',
      additive: 'sum', dur:'3.3s', fill:'freeze'
    });

   objlist.push(SObj);
   SObj.node.removeAttributeNode(SObj.node.getAttributeNode("style"));
   update_NodeList_SVG_xlink(objlist,"SVGSourceAnimation");
   return (r) 
}






// ----------------------------------------------------------------------------
// Callback Functions for Buttons

function buttonActionanimation(event){
    if ( event.preventDefault ) { event.preventDefault()};  
    event.returnValue = false;  
    var content = document.getElementById("SVGSourceAnimation").textContent;

    var uriContent = "data:image/svg+xml," + encodeURIComponent(content);
    var newWindow=window.open(uriContent, 'animation.svg');
}

function buttonActiontransformation(event){
    if ( event.preventDefault ) { event.preventDefault()};  
    event.returnValue = false;  
    var content = document.getElementById("SVGSourceTransformation").textContent;

    var uriContent = "data:image/svg+xml," + encodeURIComponent(content);
    var newWindow=window.open(uriContent, 'transformation.svg');
}

function buttonActionkreis(event){
    if ( event.preventDefault ) { event.preventDefault()};  
    event.returnValue = false;  
    var content = document.getElementById("SVGSourceKreis").textContent;

    var uriContent = "data:image/svg+xml," + encodeURIComponent(content);
    var newWindow=window.open(uriContent, 'kreis.svg');
}


function buttonActionvieleck(event){
    if ( event.preventDefault ) { event.preventDefault()};  
    event.returnValue = false;  
    var content = '<svg height="420" version="1.1" width="620" xmlns="http://www.w3.org/2000/svg">';
        content += outerHTML(document.getElementById("SVGVieleck").getElementsByTagName("path")[0]);
        content += '</svg>';
    var uriContent = "data:image/svg+xml," + encodeURIComponent(content);
    var newWindow=window.open(uriContent, 'vieleck.svg');
}


function buttonActionkurve2(event){
    if ( event.preventDefault ) { event.preventDefault()};  
    event.returnValue = false;  
    var content = '<svg height="420" version="1.1" width="620" xmlns="http://www.w3.org/2000/svg">';
        content += outerHTML(document.getElementById("SVGKurve2").getElementsByTagName("path")[0]);
        content += '</svg>';
    var uriContent = "data:image/svg+xml," + encodeURIComponent(content);
    var newWindow=window.open(uriContent, 'kurve2.svg');
}

function buttonActionkurve(event){
    if ( event.preventDefault ) { event.preventDefault()};  
    event.returnValue = false;  
    var content = '<svg height="420" version="1.1" width="620" xmlns="http://www.w3.org/2000/svg">';
        content += outerHTML(document.getElementById("SVGKurve").getElementsByTagName("path")[0]);
        content += '</svg>';
    var uriContent = "data:image/svg+xml," + encodeURIComponent(content);
    var newWindow=window.open(uriContent, 'kurve.svg');
}

function secondNavAction(event){
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
    rvieleck = SVGVielEck({r:rvieleck});
}


function secondNavActionKreise(event){
    var alist = event.currentTarget.getElementsByTagName("a");
    
    for(var i = 0, num = alist.length; i < num; i+=1) {
        if (alist[i].className === "selected"){
            alist[i].className="";
            break;  // breaks out of loop completely
        }
    }
    event.target.className="selected";
    event.currentTarget.setAttribute("data-kreise",event.target.getAttribute("anz-kreis"));
    rkreise = SVGKreis({r:rkreise});
}



function secondNavActionTransformation(event){
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

    rtransformation = SVGTransformation({r:rtransformation});
}


window.onload = function () {
    SVGDiagramm();
    rkreise = SVGKreis({id:"SVGKreis",x:620,y:420});
    rvieleck = SVGVielEck({id:"SVGVieleck",x:620,y:420});
    SVGKurve();
    SVGKurve2();
    rtransformation = SVGTransformation({id:"SVGTransformation",x:620,y:420});
    ranimation = SVGAnimation({id:"SVGAnimation",x:620,y:420});
    

    //Register Buttons

    

    var button = document.getElementById("buttonanimation");
    if(button.addEventListener){
             button.addEventListener("click", buttonActionanimation);
    } else {
             button.attachEvent("click", buttonActionanimation);
    }

    button = document.getElementById("buttontransformation");
    if(button.addEventListener){
             button.addEventListener("click", buttonActiontransformation);
    } else {
             button.attachEvent("click", buttonActiontransformation);
    }


    button = document.getElementById("buttonkreis");
    if(button.addEventListener){
             button.addEventListener("click", buttonActionkreis);
    } else {
             button.attachEvent("click", buttonActionkreis);
    }

    button = document.getElementById("buttonvieleck");
    if(button.addEventListener){
             button.addEventListener("click", buttonActionvieleck);
    } else {
             button.attachEvent("click", buttonActionvieleck);
    }

    button = document.getElementById("buttonkurve2");
    if(button.addEventListener){
             button.addEventListener("click", buttonActionkurve2);
    } else {
             button.attachEvent("click", buttonActionkurve2);
    }


    button = document.getElementById("buttonkurve1");
    if(button.addEventListener){
             button.addEventListener("click", buttonActionkurve);
    } else {
             button.attachEvent("click", buttonActionkurve);
    }

    var secondnav = document.getElementById("choose-figure");
    if(secondnav.addEventListener){
             secondnav.addEventListener("click", secondNavAction);
    } else {
             secondnav.attachEvent("click", secondNavAction);
    }

    secondnav = document.getElementById("choose-AnzKreise");
    if(secondnav.addEventListener){
             secondnav.addEventListener("click", secondNavActionKreise);
    } else {
             secondnav.attachEvent("click", secondNavActionKreise);
    }

    secondnav = document.getElementById("choose-transformation");
    if(secondnav.addEventListener){
             secondnav.addEventListener("click", secondNavActionTransformation);
    } else {
             secondnav.attachEvent("click", secondNavActionTransformation);
    }

};