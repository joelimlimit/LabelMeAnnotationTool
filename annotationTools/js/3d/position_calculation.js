function calculate_box_location(cube_object, support_object){ // make it the bottom position of the object
    //var cube_position_holder = cube_position_0.clone();
    //CalculateChildrenHeightDifferences(support_object);
    var scale_factor_x = stage.width()/stage.getScaleX();
    var scale_factor_y = stage.height()/stage.getScaleY();
    //CalculateObjectHeightDifference(cube_object);
    if (!cube_object.cube){
        cube_object.plane.matrixWorld = support_object.plane.matrixWorld.clone();
    }
    var direction = new THREE.Vector3(cube_position_0.x - camera.position.x, cube_position_0.y - camera.position.y, cube_position_0.z - camera.position.z).normalize();
    var optical_ray = new THREE.Raycaster(camera.position, direction);
    /*if (CheckIfSupportedByGroundplane(support_object) == false){
        CalculateObjectHeightDifference(cube_object);
        console.log("not supported");
        return;
    }else*/ if (!(support_object.cube)){//if support object is a plane - making the cube object plane the same height as the plane that is supporting
        collision_plane.matrixWorld = support_object.plane.matrixWorld.clone();
        var plane_intersection = optical_ray.intersectObject(collision_plane, false);
        //cube_object.plane.matrixWorld = support_object.plane.matrixWorld.clone();
            }else{//if support object is a cube - moving the plane of the cube object to the correct height
        if (cube_object != support_object) collision_plane.matrixWorld.multiplyMatrices(support_object.plane.matrixWorld.clone(), new THREE.Matrix4().makeTranslation(0, 0, support_object.cube.position.z - support_object.cube.scale.z*0.5*small_h + support_object.cube.scale.z*small_h));
       // collision_plane.matrixWorld = cube_object.plane.matrixWorld.clone();
        var plane_intersection = optical_ray.intersectObject(collision_plane, false);
		cube_object.height_from_parent_cube = support_object.cube.scale.z*small_h;
        }
    if (plane_intersection[0]){
		console.log("intersect");
		cube_object.plane.matrixWorld = collision_plane.matrixWorld.clone();
		if (cube_object.cube.parent != cube_object.plane){
            cube_object.cube.parent.matrixWorld = cube_object.plane.matrixWorld.clone();
        }
        for (var i = 0; i < plane_intersection.length; i++){
            var i_mat2 = new THREE.Matrix4().getInverse(cube_object.cube.parent.matrixWorld);
            plane_intersection[i].point.applyMatrix4(i_mat2);//x and y in support plane
            cube_object.cube.position.copy(plane_intersection[i].point);
            proportion_scale = camera.position.distanceTo(plane_intersection[i].point.applyMatrix4(collision_plane.matrixWorld.clone()))/camera.position.distanceTo(cube_position_0_static);
            cube_object.cube.scale.x = proportion_scale*old_x;
            cube_object.cube.scale.y = proportion_scale*old_y;
            cube_object.cube.scale.z = proportion_scale*old_z;
            /*arrowHelper.arrow_box.scale.x = proportion_scale*old_arrow_x;
            arrowHelper.arrow_box.scale.y = proportion_scale*old_arrow_y;
            arrowHelper.arrow_box.scale.z = proportion_scale*old_arrow_z;*/
            setup_arrowheads_rescaling(cube_object);
            cube_object.cube.position.setZ(cube_object.cube.scale.z*small_h/2);
        }
    }
    var lines_array = LMgetObjectField(LM_xml, support_object.ID, "lines");
    var lines = '';
    for (var i = 0; i < lines_array.length; i+=5){
                lines += '<vp_line>';
                lines += '<x1>' + lines_array[i] + '</x1>';
                lines += '<y1>' + lines_array[i+1] + '</y1>';
                lines += '<x2>' + lines_array[i+2] + '</x2>';
                lines += '<y2>' + lines_array[i+3] + '</y2>';
                lines += '<label>' + lines_array[i+4] + '</label>';
                lines += '</vp_line>';
        }
    LMsetObjectField(LM_xml, cube_object.ID, 'lines', lines);
	cube_object.op_x =  CalculateNewOp(cube_object.plane.matrixWorld.clone().elements)[0];
	cube_object.op_y = CalculateNewOp(cube_object.plane.matrixWorld.clone().elements)[1];
    op_points = cube_object.op_x/scale_factor_x + ' ' + cube_object.op_y/scale_factor_y;
    LMsetObjectField(LM_xml, cube_object.ID, 'op_points', op_points);
    //proportion_array[cube_object.ID] = arrowHelper.arrow_box.scale.x;
    //CalculateChildrenHeightDifferences(support_object, proportion_scale);
    main_threed_handler.BoxAutoSave(cube_object.ID);
    if (cube_object.hchildren.length > 0){
        for (var i = 0; i < cube_object.hchildren.length; i++){
            calculate_children_box_locations(cube_object.hchildren[i], proportion_scale);
        }
    }
	old_x = cube_object.cube.scale.x;
	old_y = cube_object.cube.scale.y;
	old_z = cube_object.cube.scale.z;
	cube_position_0 = cube_object.cube.position.clone();
	cube_position_0.setZ(cube_position_0.z - cube_object.cube.scale.z*0.5*small_h);
	cube_position_0 = cube_position_0.applyMatrix4(cube_object.cube.parent.matrixWorld.clone());
	cube_position_0_static = cube_position_0.clone();
    if (window.select) check_plane_box_collision();
    arrow_box_position = null;
    indicator_box_position = null;
    render();
    //CalculateChildrenHeightDifferences(support_object);
}

function calculate_children_box_locations(object, parent_scale){
    var scale_factor_x = stage.width()/stage.getScaleX();
    var scale_factor_y = stage.height()/stage.getScaleY();
    //CalculateChildrenHeightDifferences(object);
    if (!object.cube){
        object.plane.matrixWorld = object.hparent.plane.matrixWorld.clone();
        return;
    }

    target_cube_position_0 = object.cube.position.clone();
    target_cube_position_0.setZ(object.cube.position.z - object.cube.scale.z*small_h/2);
    target_cube_position_0_static = object.cube.position.clone();
    target_cube_position_0_static.setZ(object.cube.position.z - object.cube.scale.z*small_h/2);
    target_cube_position_0.applyMatrix4(object.cube.parent.matrixWorld.clone());
    target_cube_position_0_static.applyMatrix4(object.cube.parent.matrixWorld.clone());
    target_cube_scale_0 = object.cube.scale.clone();
    var holder = object.height_from_parent_cube;
	if (typeof object.height_from_parent_cube == "undefined"){
		object.plane.matrixWorld.multiplyMatrices(object.hparent.plane.matrixWorld.clone(), new THREE.Matrix4().makeTranslation(0, 0, object.hparent.cube.position.z + object.hparent.cube.scale.z*0.5*small_h));
		object.height_from_parent_cube = object.hparent.cube.scale.z*small_h;
	}else{	
    	object.plane.matrixWorld.multiplyMatrices(object.hparent.plane.matrixWorld.clone(), new THREE.Matrix4().makeTranslation(0, 0, object.hparent.cube.position.z - object.hparent.cube.scale.z*small_h*0.5 + holder*parent_scale));
		object.height_from_parent_cube = object.height_from_parent_cube*parent_scale;
	}
    if (object.cube.parent != object.plane){
            object.cube.parent.matrixWorld = object.plane.matrixWorld.clone();
    }
    var direction = new THREE.Vector3(target_cube_position_0.x - camera.position.x, target_cube_position_0.y - camera.position.y, target_cube_position_0.z - camera.position.z).normalize();
    var optical_ray = new THREE.Raycaster(camera.position, direction);
    var plane_intersection = optical_ray.intersectObject(object.plane, false);
    if (plane_intersection[0]){
        for (var i = 0; i < plane_intersection.length; i++){
            var i_mat = new THREE.Matrix4().getInverse(object.cube.parent.matrixWorld.clone());
            plane_intersection[i].point.applyMatrix4(i_mat);
            object.cube.position.copy(plane_intersection[i].point);
            var proportion_scale = camera.position.distanceTo(plane_intersection[i].point.applyMatrix4(object.cube.parent.matrixWorld.clone()))/camera.position.distanceTo(target_cube_position_0_static);
            object.cube.scale.x = proportion_scale*target_cube_scale_0.x;
            object.cube.scale.y = proportion_scale*target_cube_scale_0.y;
            object.cube.scale.z = proportion_scale*target_cube_scale_0.z;
            object.cube.position.setZ(object.cube.scale.z*small_h/2);
        }
    }
    if (typeof proportion_array[object.ID] == "undefined"){
        proportion_array[object.ID] = 1;
    }
    //proportion_array[object.ID] = proportion_scale*proportion_array[object.ID]

    var lines_array = LMgetObjectField(LM_xml, object.hparent.ID, "lines");
    var lines = '';
    for (var i = 0; i < lines_array.length; i+=5){
                lines += '<vp_line>';
                lines += '<x1>' + lines_array[i] + '</x1>';
                lines += '<y1>' + lines_array[i+1] + '</y1>';
                lines += '<x2>' + lines_array[i+2] + '</x2>';
                lines += '<y2>' + lines_array[i+3] + '</y2>';
                lines += '<label>' + lines_array[i+4] + '</label>';
                lines += '</vp_line>';
        }
    LMsetObjectField(LM_xml, object.ID, 'lines', lines);
    object.op_x =  CalculateNewOp(object.plane.matrixWorld.elements)[0];
	object.op_y = CalculateNewOp(object.plane.matrixWorld.elements)[1];
    op_points = object.op_x/scale_factor_x + ' ' + object.op_y/scale_factor_y;
    LMsetObjectField(LM_xml, object.ID, 'op_points', op_points);
	main_threed_handler.BoxAutoSave(object.ID);
    if (object.hchildren){
        for (var i = 0; i < object.hchildren.length; i++){
            calculate_children_box_locations(object.hchildren[i], proportion_scale)
        }
    }
    //CalculateChildrenHeightDifferences(object);
        render();
}


function CalculateBoxCanBeAdded(cube_object, support_object){
    var cube_position = cube_object.cube.position.clone();
    cube_position.setZ(cube_position.z - cube_object.cube.scale.z*small_h/2).applyMatrix4(cube_object.cube.parent.matrixWorld.clone());
    var direction = new THREE.Vector3(cube_position.x - camera.position.x, cube_position.y - camera.position.y, cube_position.z - camera.position.z).normalize();
    var optical_ray = new THREE.Raycaster(camera.position, direction);
    if (!(support_object.cube)){//if support object is a plane - making the cube object plane the same height as the plane that is supporting
        collision_plane.matrixWorld = support_object.plane.matrixWorld.clone();
        var plane_intersection = optical_ray.intersectObject(collision_plane, false);
    }else{//if support object is a cube - moving the plane of the cube object to the correct height
        collision_plane.matrixWorld.multiplyMatrices(support_object.plane.matrixWorld.clone(), (new THREE.Matrix4()).makeTranslation(0, 0, support_object.position.z + support_object.cube.scale.z*small_h*0.5))
        //cube_object.plane.matrixWorld.multiplyMatrices(support_object.plane.matrixWorld.clone(), (new THREE.Matrix4()).makeTranslation(0, 0, support_object.cube.scale.z*small_h));
        var plane_intersection = optical_ray.intersectObject(collision_plane, false);
    }
    if (plane_intersection[0]){
        return true;
    }else{
        return false;
    }
}

function CheckIfSupportedByGroundplane(object){
    var ancestor = object;
    while (ancestor.hparent && ancestor.hparent != "unassigned"){
        ancestor = ancestor.hparent;
    }
    if (ancestor.plane == plane || (ancestor.plane && !(ancestor.cube))){
        return true;
    }else{
        return false;
    }
}
