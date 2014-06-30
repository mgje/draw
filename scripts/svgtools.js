 window.onload = function () {
    var r = Raphael("SVGKurve", 620, 420),
        discattr = {fill: "#fff", stroke: "none"};
    r.rect(0, 0, 619, 419, 10).attr({fill: "#000",stroke: "#666"});
    // r.text(310, 20, "Drag the points to change the curves").attr({fill: "#fff", "font-size": 16});
    function update_Kurve_SVG(){
        var s = S('<svg height="420" version="1.1" width="620" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden; position: relative; left: -0.5px; top: -0.875px;">').escapeHTML().s;
        s += S(r.getById(2).node.outerHTML).escapeHTML().s;
        s += S('</svg>' ).escapeHTML().s;
        document.getElementById("SVGSourceKurve").innerHTML=s;
    }

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

        controls[1].update = function (x, y) {
            var X = this.attr("cx") + x,
                Y = this.attr("cy") + y;
            this.attr({cx: X, cy: Y});
            path[0][1] = X;
            path[0][2] = Y;
            path2[0][1] = X;
            path2[0][2] = Y;
            controls[2].update(x, y);
            document.getElementById("SVGSourceKurve").innerHTML=S(r.getById(2).node.outerHTML).escapeHTML().s;
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
            document.getElementById("SVGSourceKurve").innerHTML=S(r.getById(2).node.outerHTML).escapeHTML().s;
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
            document.getElementById("SVGSourceKurve").innerHTML=S(r.getById(2).node.outerHTML).escapeHTML().s;
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
            document.getElementById("SVGSourceKurve").innerHTML=S(r.getById(2).node.outerHTML).escapeHTML().s;
        };
        controls.drag(move, up);
    }
    function move(dx, dy) {
        this.update(dx - (this.dx || 0), dy - (this.dy || 0));
        this.dx = dx;
        this.dy = dy;
    }
    function up() {
        this.dx = this.dy = 0;
    }

    curve(70, 100, 261, 62, 237, 289, 486, 259, "hsb(0, .75, .75)");
    // curve(170, 100, 210, 100, 230, 200, 270, 200, "hsb(.8, .75, .75)");
    // curve(270, 100, 310, 100, 330, 200, 370, 200, "hsb(.3, .75, .75)");
    // curve(370, 100, 410, 100, 430, 200, 470, 200, "hsb(.6, .75, .75)");
    // curve(470, 100, 510, 100, 530, 200, 570, 200, "hsb(.1, .75, .75)");

    //var ss = document.getElementById("SVGKurve").innerHTML;
    //document.getElementById("SVGSourceKurve").innerHTML=S(r.getById(2).node.outerHTML).escapeHTML().s;
    update_Kurve_SVG();

};