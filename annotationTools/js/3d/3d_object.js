function object_instance(){
    this.hparent = "unassigned";
    this.hchildren = [];
    this.ID;
    this.label;
    this.model;
    this.holder; //for the parent ID in the load function

    this.plane;
	this.op_x;
	this.op_y;
    //this.plane = empty_plane.clone();
    //this.plane.material = new THREE.MeshBasicMaterial({color:0x00E6E6, side:THREE.DoubleSide, wireframe: true});
    //this.plane.matrixAutoUpdate=false;
    //this.plane.slider_value = 60;
    this.icon;

    this.cube;
    this.lock_inside_clip_area = false;
    this.op_y = null;
    this.height_from_parent_cube;

}

function check_oldest_ancestor(oldest_ancestor){
    while (oldest_ancestor != "unassigned" && typeof oldest_ancestor != "undefined"){
        oldest_ancestor = oldest_ancestor.hparent;
    }
    return oldest_ancestor;
}
