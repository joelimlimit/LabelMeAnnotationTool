var op_x = 50, op_y = 50;
var vp_s = new Array();
var vp = new Array();
var gp = new Array(); // guiding-z-line
var vp_label = new Array();
var vp_layer;
var pt_layer;
var stage;
var selected_line_id;
var lineOn = false;
var original_number_of_lines = 0;

function VP() {//initializing as 0
    this.x2d = 0;
    this.y2d = 0;
}

function VP_s() {
    var x2d = new Array();
    var y2d = new Array();

    var xc = document.getElementById("img").width/2;
    var yc = document.getElementById("img").height/3;

    // left-top-front
    x2d[0] = xc;
    y2d[0] = yc;

    // right-top-front
    x2d[1] = xc;
    y2d[1] = yc;

    this.x2d = x2d;
    this.y2d = y2d;
}

/*function checkTwoLines(index){
    var counter = 0;
    for (var i = 0; i < vp_label.length; i++){
        if (vp_label[i] == index){
            counter = counter + 1;
        }
    }
    console.log(counter);
    if (counter > 2){
        return true;
    }
    else if (index != 0){
        alert("You must have at least two lines of the same color");
        return false;
    }
}*/

/*function onDocumentKeyDown(evt) {
    console.log(evt.keyCode);
    switch (evt.keyCode) {
        case 46:
            if (typeof selected_line_id != "undefined"){
                var layer = vp_layer;
                var counter = 0;
                for (var i = 0; i < vp_label.length; i++){
                    if (vp_label[i] == vp_label[selected_line_id]){
                        counter = counter + 1;
                    }
                }
                console.log(counter);
                if (counter > 2){
                    vp_label.splice(selected_line_id, 1);
                    layer.get('.l' + (selected_line_id)).each(function(shape){
                        shape.remove();
                    });
                    layer.get('.p' + (selected_line_id)*2).each(function(shape){
                        shape.remove();
                    });
                    layer.get('.p' + ((selected_line_id)*2 + 1)).each(function(shape){
                        shape.remove();
                    });
                    stage.draw();
                }
                else{
                    alert("There must always be at least two lines of the same color.");
                }
            }
            break;
        case 71:
        	var id = vp_s.length;
        	vp_s[id] = new VP_s();
        	vp_s[id].x2d[0] = vp_s[id].x2d[0] - 100;//constants are arbitrary for initial lines.
        	vp_s[id].x2d[1] = vp_s[id].x2d[1] - 50;
        	vp_s[id].y2d[0] = vp_s[id].y2d[0] - 60;
        	vp_s[id].y2d[1] = vp_s[id].y2d[1] - 50;
        	vp_label[id] = 1;
        	addVPline(id, vp_layer);
        	stage.draw();
            update_plane()
        	break;
        case 82:
        	var id = vp_s.length;
        	vp_s[id] = new VP_s();
        	vp_s[id].x2d[0] = vp_s[id].x2d[0] + 100;//constants are arbitrary for initial lines.
        	vp_s[id].x2d[1] = vp_s[id].x2d[1] + 50;
        	vp_s[id].y2d[0] = vp_s[id].y2d[0] - 60;
        	vp_s[id].y2d[1] = vp_s[id].y2d[1] - 50;
        	vp_label[id] = 2;
        	addVPline(id, vp_layer);
        	stage.draw();
            update_plane();
        	break;
    }
}*/


function init2() {
    document.addEventListener( 'keydown', onDocumentKeyDown, false );

    stage = new Kinetic.Stage({
	container: 'container',
	id: 'kinetic_cnvs',
	width: document.getElementById("img").width,
	height: document.getElementById("img").height,
	x: 0,
	y: 0
    });
    document.getElementById("cnvs").height = document.getElementById("img").height;

    vp_layer = new Kinetic.Layer();
    stage.add(vp_layer);

    stage.draw();

    //draw_vp(); //draw the lines that the user will drag around.

    pt_layer = new Kinetic.Layer();

    var circle = new Kinetic.Circle({//this is the draggable point
	x: 350,
	y: 350,
	radius: 8,
	stroke: 'blue',
	//fill: 'blue',
	draggable: true,
    });
    op_x = 350;
    op_y = 350;
    circle.on("dragmove", op_drag);
    pt_layer.add(circle);

    stage.add(pt_layer);

    last_update = -999999;

}

function gp_drag(e) {
    var gp_line = e.targetNode;
    var projector = new THREE.Projector();
    var mouse3D = projector.unprojectVector(new THREE.Vector3( ( gp_line.x()/ renderer.domElement.width ) * 2 - 1, - ( gp_line.y() / renderer.domElement.height ) * 2 + 1, 1 ), camera );
    var direction = mouse3D.sub(camera.position).normalize();
    ray = new THREE.Raycaster(camera.position, mouse3D);
    ray.set(camera.position, direction);
    var current_plane = plane; //window.select.support_plane;
    a = ray.intersectObject(current_plane, true);

    var hitAny = false;
    for (var i = 0; i < a.length; i++) {
	if (a[i].object.id == current_plane.id) {
	    hitAny = true;
	    var i_mat = new THREE.Matrix4().getInverse(current_plane.matrixWorld);
	    a[i].point.applyMatrix4(i_mat);
	    guide_box.lines[gp_line.gp_id].position.set(a[i].point.x,a[i].point.y,a[i].point.z);
	    render();
	}
    }
    guide_box.lines[gp_line.gp_id].visible=hitAny;
}
function add_gp_circle(gp_id) {
    var circle = new Kinetic.Circle({//this is the draggable point
					x: 350+(gp_id+1-(gp_id%2))*35*Math.pow(-1,gp_id),
					y: document.getElementById("img").height-10,
					radius: 8,
					stroke: 'yellow',
					draggable: true,
				    });
    circle.on("dragmove", gp_drag);
    circle.gp_id = gp_id;
    pt_layer.add(circle);

    return circle;
}

function dist2(a, b) {//distances squared between two vp_s
    return Math.pow(a.x2d-b.x2d,2) + Math.pow(a.y2d-b.y2d,2);
}

function op_drag(e) {
    //reassigning circle coordinates after it is moved
    op_x = e.targetNode.x();
    op_y = e.targetNode.y();

    update_plane();
}

function point_drag() {
    var point_id = this.name();
    var layer = this.getParent();
    var point_id = parseInt(point_id.substring(1));
    var line_id = Math.floor(point_id / 2);

    if (point_id % 2 == 0) {//reassigning coordinates of line endpoints based on which color/pair they belong to.
    	vp_s[line_id].x2d[0] = this.getPosition().x;
    	vp_s[line_id].y2d[0] = this.getPosition().y;
        /*stage.get('.d' + (point_id)).each(function(dot){
            dot.setPosition(vp_s[line_id].x2d[0], vp_s[line_id].y2d[0]);
        });
        stage.get('.p' + (point_id)).each(function(dot){
            dot.setPosition(vp_s[line_id].x2d[0], vp_s[line_id].y2d[0]);
        });*/
        //var dot = stage.find('.d' + (point_id))[0];
        stage.setPosition(vp_s[line_id].x2d[0], vp_s[line_id].y2d[0]);
    } else if (point_id % 2 == 1) {
    	vp_s[line_id].x2d[1] = this.getPosition().x;
    	vp_s[line_id].y2d[1] = this.getPosition().y;
        //var dot = stage.find('.d' + (point_id))[0];
        //dot.setPosition(vp_s[line_id].x2d[0], vp_s[line_id].y2d[0]);
        /*stage.get('.d' + (point_id)).each(function(dot){
            dot.setPosition(vp_s[line_id].x2d[1], vp_s[line_id].y2d[1]);
        });
        stage.get('.p' + (point_id)).each(function(dot){
            dot.setPosition(vp_s[line_id].x2d[1], vp_s[line_id].y2d[1]);
        });*/
    }

    layer.get('.l'+(line_id)).each(function(line,n) {
		line.points([vp_s[line_id].x2d[0], vp_s[line_id].y2d[0], vp_s[line_id].x2d[1], vp_s[line_id].y2d[1]]);
	});

    update_plane();
}

/*function highlight_line(){
    var point_id = this.name();
    var layer = this.getParent();
    var point_id = parseInt(point_id.substring(1));
    var line_id = Math.floor(point_id/2);
    var color = ['', 'green', 'red'];
    if (line_id == selected_line_id){
        selected_line_id = undefined;
        layer.get('.l' + (line_id)).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
        });
        layer.get('.p' + (line_id)*2).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
        });
        layer.get('.p' + ((line_id)*2 + 1)).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
        });
        stage.draw();
    }
    else{
        if (typeof selected_line_id != "undefined"){
            layer.get('.l' + (selected_line_id)).each(function(shape){
                shape.setStroke(color[vp_label[selected_line_id]]);
            });
            layer.get('.p' + (selected_line_id)*2).each(function(shape){
                shape.setStroke(color[vp_label[selected_line_id]]);
            });
            layer.get('.p' + ((selected_line_id)*2 + 1)).each(function(shape){
                shape.setStroke(color[vp_label[selected_line_id]]);
            });
        }
        selected_line_id = line_id;
        layer.get('.l' + (line_id)).each(function(shape){
            shape.setStroke('yellow');
        });
        layer.get('.p' + (line_id)*2).each(function(shape){
            shape.setStroke('yellow');
        });
        layer.get('.p' + ((line_id)*2 + 1)).each(function(shape){
            shape.setStroke('yellow');
        });
        stage.draw();
    }
}*/

function onMouseOver(){
    lineOn = true;
    var color = ['yellow', 'green', 'red', 'orange'];
    var point_id = this.name();
    var layer = this.getParent();
    var point_id = parseInt(point_id.substring(1));
    if (this.name()[0] == 'p' || this.name()[0] == 'd'){
        var line_id = Math.floor(point_id/2);
    }else if (this.name()[0] == 'l'){
        var line_id = point_id;
    }
    layer.get('.p' + (line_id)*2).each(function(shape){
        shape.setStroke(color[vp_label[line_id]]);
        shape.radius(16);
    });
    layer.get('.p' + ((line_id)*2 + 1)).each(function(shape){
        shape.setStroke(color[vp_label[line_id]]);
        shape.radius(16);
    });
    layer.get('.l' + line_id).each(function(shape){
        shape.strokeWidth(5);
    });
    var instructions = "<b>Click and drag circles to move line.</b>";
    instruct(instructions);
    stage.draw();
}

function onMouseOut(){
    lineOn = false;
    var color = ['yellow', 'green', 'red', 'orange'];
    var point_id = this.name();
    var layer = this.getParent();
    var point_id = parseInt(point_id.substring(1));
    if (this.name()[0] == 'g'){
        var line_id = Math.floor(point_id/2);
    }else if (this.name()[0] == 'l'){
        var line_id = point_id;
    }
    if (vp_label[line_id] != 0){
        layer.get('.p' + (line_id)*2).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
            shape.radius(8);
        });
        layer.get('.p' + ((line_id)*2 + 1)).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
            shape.radius(8);
        });
    }
    layer.get('.l' + line_id).each(function(shape){
        shape.strokeWidth(2);
    });
    instruct(DEFAULT_INSTR);
    stage.draw();
}

function changeLineType(){
    var point_id = this.name();
    var layer = this.getParent();
    var point_id = parseInt(point_id.substring(1));
    if (this.name()[0] == 'p'){
        var line_id = Math.floor(point_id/2);
    }else if (this.name()[0] == 'l'){
        var line_id = point_id;
    }
    var color = ['yellow', 'green', 'red', 'orange'];
    if (vp_label[line_id] == 1){
        vp_label[line_id] = 2;
        layer.get('.l' + (line_id)).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
        });
        layer.get('.p' + (line_id)*2).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
        });
        layer.get('.p' + ((line_id)*2 + 1)).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
        });
        layer.get('.d' + (line_id)*2).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
        });
        layer.get('.d' + ((line_id)*2 + 1)).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
        });
        layer.get('.d' + (line_id)*2).each(function(shape){
            shape.setFill(color[vp_label[line_id]]);
        });
        layer.get('.d' + ((line_id)*2 + 1)).each(function(shape){
            shape.setFill(color[vp_label[line_id]]);
        });
    }else if (vp_label[line_id] == 2){
        vp_label[line_id] = 3;
        layer.get('.l' + (line_id)).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
        });
        layer.get('.p' + (line_id)*2).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
        });
        layer.get('.p' + ((line_id)*2 + 1)).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
        });
        layer.get('.d' + (line_id)*2).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
        });
        layer.get('.d' + ((line_id)*2 + 1)).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
        });
        layer.get('.d' + (line_id)*2).each(function(shape){
            shape.setFill(color[vp_label[line_id]]);
        });
        layer.get('.d' + ((line_id)*2 + 1)).each(function(shape){
            shape.setFill(color[vp_label[line_id]]);
        });
    }else if (vp_label[line_id] == 3){
        vp_label[line_id] = 0;
        layer.get('.l' + (line_id)).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
        });
        layer.get('.p' + (line_id)*2).each(function(shape){
            shape.remove();
        });
        layer.get('.p' + ((line_id)*2 + 1)).each(function(shape){
            shape.remove();
        });
        layer.get('.d' + (line_id)*2).each(function(shape){
            shape.remove();
        });
        layer.get('.d' + ((line_id)*2 + 1)).each(function(shape){
            shape.remove();
        });
    }else if (vp_label[line_id] == 0){
        vp_label[line_id] = 1;
        layer.get('.l' + (line_id)).each(function(shape){
            shape.setStroke(color[vp_label[line_id]]);
        });
        addVPCircles(line_id, vp_layer);
    }
    stage.draw();
    update_plane();
}


function update_plane() {
    console.log("plane updated");
    var d = new Date();
    current_time = d.getTime();
    if (current_time - last_update > 100) {
	last_update = current_time;
    } else if (!isNaN(f)){
        console.log("skipping");
	return ;
    }

    if ((typeof GLOBAL_DEBUG != 'undefined') &&(GLOBAL_DEBUG)) {

    } else {// for this part of the code, integrate new line
    	for (var l = 1; l <= 3; l++) {
    	    vp[l-1] = new VP();
    	    var vp_cou = 0;
    	    for (var i = 0; i < vp_s.length; i++) {
        		if (vp_label[i] != l)
        		continue;
        		for (var j = i+1; j < vp_s.length; j++) {
        		    if (vp_label[j] != l)
        			continue;

        		    // vanishing points
        		    var x1 = vp_s[i].x2d[0];//assigning vanishing point coordinates to variables for ease of calculation
        		    var x2 = vp_s[i].x2d[1];
        		    var x3 = vp_s[j].x2d[0];
        		    var x4 = vp_s[j].x2d[1];

        		    var y1 = vp_s[i].y2d[0];
        		    var y2 = vp_s[i].y2d[1];
        		    var y3 = vp_s[j].y2d[0];
        		    var y4 = vp_s[j].y2d[1];

        		    vp[l-1].x2d += ((x1*y2-y1*x2)*(x3-x4) - (x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));//x coordinate of first vanishing point
        		    vp[l-1].y2d += ((x1*y2-y1*x2)*(y3-y4) - (y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));//y coordinate of first vanishing point
        		    vp_cou = vp_cou + 1;
        		}
    	    }
    	    vp[l-1].x2d /= vp_cou;
    	    vp[l-1].y2d /= vp_cou;
    	}
    }
    var vp_counter = 0;
    for (var i = 0; i < vp.length; i++){
        if (isNaN(vp[i].x2d) == false){
            vp_counter += 1;
        }
    }
    var vp1;
    var vp2;
    if (vp_counter == 2){
        vp_counter = 0;
        for (var i = 0; i < vp.length; i++){
            if (isNaN(vp[i].x2d) == false){
                if (vp_counter == 0){
                    vp1 = vp[i];
                }else{
                    vp2 = vp[i];
                }
                vp_counter += 1;
            }
        }
        var cx = document.getElementById("img").width/2;
        var cy = document.getElementById("img").height/2;
        var u = ((cx - vp1.x2d)*(vp2.x2d-vp1.x2d) + (cy - vp1.y2d)*(vp2.y2d-vp1.y2d))/ dist2(vp2, vp1);
        var vi = new VP();
        vi.x2d = vp1.x2d + u * (vp2.x2d - vp1.x2d);
        vi.y2d = vp1.y2d + u * (vp2.y2d - vp1.y2d);

        //f = Math.sqrt(Math.pow(((cx - vp[0].x2d)*(vp[1].x2d - cx)), 2) + Math.pow(((cy - vp[0].y2d)*(vp[1].y2d - cy)), 2));
        f = Math.sqrt(Math.sqrt(dist2(vi, vp1)) * Math.sqrt(dist2(vi, vp2)));//this is the focal distance / this is actually OcVi

        // rotation / translation/extrinsic
        axis_x = vec3.create();
        vec3.set(axis_x, vp1.x2d - cx, vp1.y2d - cy, f);
        vec3.normalize(axis_x, axis_x);

        axis_y = vec3.create();
        vec3.set(axis_y, vp2.x2d - cx, vp2.y2d - cy, f);
        vec3.normalize(axis_y, axis_y);

        axis_z = vec3.create();
        vec3.set(axis_z, vp[2].x2d - cx, vp[2].y2d - cy, f);
        vec3.normalize(axis_z, axis_z);
        vec3.cross(axis_z, axis_x, axis_y);
    }else{
        var side1_slope = (vp[1].y2d - vp[0].y2d)/(vp[1].x2d - vp[0].x2d);
        var side2_slope = (vp[2].y2d - vp[1].y2d)/(vp[2].x2d - vp[1].x2d);
        var side3_slope = (vp[2].y2d - vp[0].y2d)/(vp[2].x2d - vp[0].x2d);
        var perp_slope1 = -1/side1_slope;
        var perp_slope2 = -1/side2_slope;
        var perp_slope3 = -1/side3_slope;

        var cx = (perp_slope1*vp[2].x2d - perp_slope2*vp[0].x2d + vp[0].y2d - vp[2].y2d)/(perp_slope1-perp_slope2);
        var cy = perp_slope1*(cx - vp[2].x2d) + vp[2].y2d;
        var u = ((cx - vp[0].x2d)*(vp[1].x2d-vp[0].x2d) + (cy - vp[0].y2d)*(vp[1].y2d-vp[0].y2d))/ dist2(vp[1], vp[0]);
        var vi = new VP();
        vi.x2d = vp[0].x2d + u * (vp[1].x2d - vp[0].x2d);
        vi.y2d = vp[0].y2d + u * (vp[1].y2d - vp[0].y2d);

        //f = Math.sqrt(Math.pow(((cx - vp[0].x2d)*(vp[1].x2d - cx)), 2) + Math.pow(((cy - vp[0].y2d)*(vp[1].y2d - cy)), 2));
        f = Math.sqrt(Math.sqrt(dist2(vi, vp[0])) * Math.sqrt(dist2(vi, vp[1])));//this is the focal distance / this is actually OcVi

        // rotation / translation/extrinsic
        axis_x = vec3.create();
        vec3.set(axis_x, vp[0].x2d - cx, vp[0].y2d - cy, f);
        vec3.normalize(axis_x, axis_x);

        axis_y = vec3.create();
        vec3.set(axis_y, vp[1].x2d - cx, vp[1].y2d - cy, f);
        vec3.normalize(axis_y, axis_y);

        axis_z = vec3.create();
        vec3.set(axis_z, vp[2].x2d - cx, vp[2].y2d - cy, f);
        //vec3.cross(axis_z, axis_x, axis_y);
        vec3.normalize(axis_z, axis_z);
    }


    K = mat4.create();//transformation matrix
    K[0] = axis_x[0];
    K[1] = -axis_x[1];
    K[2] = -axis_x[2];
    K[3] = 0;
    K[4] = axis_y[0];
    K[5] = -axis_y[1];
    K[6] = -axis_y[2];
    K[7] = 0;
    K[8] = axis_z[0];
    K[9] = -axis_z[1];
    K[10] = -axis_z[2];
    K[11] = 0;
    K[12] = -(axis_x[0]+axis_y[0]) + (op_x - document.getElementById("img").width/2)/f;
    K[13] = (axis_x[1]+axis_y[1]) -(op_y - document.getElementById("img").height/2)/f;
    K[14] = (axis_x[2]+axis_y[2]) -1;
    K[15] = 1;

    rerender_plane(K);

    // now find guide line location and update circles
    for (var i = 0; i < guide_box.lines.length; i++) {
	if (typeof gp[i] === 'undefined') {
	    gp[i] = add_gp_circle(i);
	    stage.draw();
	}
	var e = new VP();
	e.targetNode = gp[i];
	gp_drag(e);
    }
}

function load_vp(vp_out){
    var scale_factor_x = document.getElementById('img').width / document.getElementById('img').naturalWidth;
    var scale_factor_y = document.getElementById("img").height / document.getElementById('img').naturalHeight;
    if (vp_out.split("\n").length < 5){
        for (var i = 0; i < 4; i++) {
            vp_s[i] = new VP_s();
        }
        vp_s[0].x2d[0] = vp_s[0].x2d[0] - 100*3;//constants are arbitrary for initial lines.
        vp_s[0].x2d[1] = vp_s[0].x2d[1] - 50*3;
        vp_s[0].y2d[0] = vp_s[0].y2d[0] - 60*3;
        vp_s[0].y2d[1] = vp_s[0].y2d[1] - 50*3;
        vp_label[0] = 1;
        addVPline(0, vp_layer);

        vp_s[1].x2d[0] = vp_s[1].x2d[0] - 100*3;
        vp_s[1].x2d[1] = vp_s[1].x2d[1] - 50*3;
        vp_s[1].y2d[0] = vp_s[1].y2d[0] + 50*1;
        vp_s[1].y2d[1] = vp_s[1].y2d[1] + 50*1;
        vp_label[1] = 1;
        addVPline(1, vp_layer);

        vp_s[2].x2d[0] = vp_s[2].x2d[0] + 100*3;
        vp_s[2].x2d[1] = vp_s[2].x2d[1] + 50*3;
        vp_s[2].y2d[0] = vp_s[2].y2d[0] - 60*3;
        vp_s[2].y2d[1] = vp_s[2].y2d[1] - 50*3;
        vp_label[2] = 2;
        addVPline(2, vp_layer);

        vp_s[3].x2d[0] = vp_s[3].x2d[0] + 100*3;
        vp_s[3].x2d[1] = vp_s[3].x2d[1] + 50*3;
        vp_s[3].y2d[0] = vp_s[3].y2d[0] + 50*1;
        vp_s[3].y2d[1] = vp_s[3].y2d[1] + 50*1;
        vp_label[3] = 2;
        addVPline(3, vp_layer);
    }else{
        var lines = vp_out.split("\n");
        lines.shift();
        console.log(lines);
        var red = lines.shift().split(" ");
        var green = lines.shift().split(" ");
        var orange = lines.shift().split(" ");
        for (var i = 0; i < green.length; i++){
            vp_label[green[i]] = 1;
        }
        for (var i = 0; i < red.length; i++){
            vp_label[red[i]] = 2;
        }
        for (var i = 0; i < orange.length; i++){
            vp_label[orange[i]] = 3;
        }
        original_number_of_lines = lines.length;
        for (var i = 0; i < lines.length; i++){
            vp_s[i] = new VP_s();
            if (vp_label[i] != 1 && vp_label[i] != 2 && vp_label[i] != 3){// outputting too many and also not getting rid of NaNs
                vp_label[i] = 0;
            }
        }
        for (var i = 0; i < lines.length; i++){
            var coordinates = lines[i].split(" ");
            if (isNaN(coordinates[1]) == false){
                vp_s[i].x2d[0] = coordinates[0]*scale_factor_x;
                vp_s[i].y2d[0] = coordinates[1]*scale_factor_y;
                vp_s[i].x2d[1] = coordinates[2]*scale_factor_x;
                vp_s[i].y2d[1] = coordinates[3]*scale_factor_y;
                addVPline(i, vp_layer);
            }
        }
    }
    stage.draw();
    update_plane();
}


function addVPline(id, layer) {
    var color = ['yellow', 'green', 'red', 'orange'];
    var label = vp_label[id];

    var line = new Kinetic.Line({
				    points: [vp_s[id].x2d[0], vp_s[id].y2d[0], vp_s[id].x2d[1], vp_s[id].y2d[1]],
				    stroke: color[label],
				    dash: [5, 5],
				    strokeWidth: 2,
				    name: 'l'+id
				});
    line.on("click", changeLineType);
    line.on("mouseover", onMouseOver);
    line.on("mouseout", onMouseOut);
    layer.add(line);
    if (vp_label[id] != 0){
        addVPCircles(id, layer);
    }
}

function addVPCircles(id, layer){
    var color = ['yellow', 'green', 'red', 'orange'];
    var label = vp_label[id];
    var circle_actual = new Kinetic.Circle({
        x: 0,
        y: 0,
        radius: 8,
        stroke: color[label],
        //strokeWidth: 2,
        draggable: false,
        name: 'p'+(id*2)
    });
    var circle = new Kinetic.Group({
        x: vp_s[id].x2d[0],
        y: vp_s[id].y2d[0],
        draggable: true,
        name: 'g'+(id*2)
    });
    var dot = new Kinetic.Circle({
        x: 0,
        y: 0,
        radius: 4,
        stroke: color[label],
        fill: color[label],
        draggable: false,
        name: 'd'+(id*2)
    });
    circle.on("dragmove", point_drag);
    circle.on("click", changeLineType);
    circle.on("mouseover", onMouseOver);
    circle.on("mouseout", onMouseOut);
    dot.on("click", changeLineType);
    dot.on("mouseover", onMouseOver);
    dot.on("mouseout", onMouseOut);
    circle.add(circle_actual);
    circle.add(dot);
    layer.add(circle);
    //layer.add(dot);

    var circle_actual = new Kinetic.Circle({
        x: 0,
        y: 0,
        radius: 8,
        stroke: color[label],
        //strokeWidth: 2,
        draggable: false,
        name: 'p'+(id*2 + 1)
    });
    var circle = new Kinetic.Group({
        x: vp_s[id].x2d[1],
        y: vp_s[id].y2d[1],
        draggable: true,
        name: 'g'+(id*2 + 1)
    });
     var dot = new Kinetic.Circle({
        x: 0,
        y: 0,
        radius: 4,
        stroke: color[label],
        fill: color[label],
        draggable: false,
        name: 'd'+(id*2 + 1)
    });
    circle.on("dragmove", point_drag);
    circle.on("click", changeLineType);
    circle.on("mouseover", onMouseOver);
    circle.on("mouseleave", onMouseOut);
    dot.on("click", changeLineType);
    dot.on("mouseover", onMouseOver);
    dot.on("mouseout", onMouseOut);
    circle.add(circle_actual);
    circle.add(dot);
    layer.add(circle);
}

