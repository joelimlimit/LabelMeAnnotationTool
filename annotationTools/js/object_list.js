// Here is all the code that builds the list of objects on the right-hand 
// side of the Labelme tool.
//
// The styles for this tools are defined inside:
// annotationTools/css/object_list.css


var IsHidingAllPolygons = false;

// This function creates and populates the list 
function RenderObjectList() {
  // If object list has been rendered, then remove it:
  console.log("Rendering object list");
  if($('#anno_list').length) {
    $('#anno_list').remove();
  }

  var html_str = '<div class="object_list" id="anno_list" style="border:0px solid black;z-index:0;" ondrop="drop(event, -1)" ondragenter="return dragEnter(event)" ondragover="return dragOver(event)">';
  
  var Npolygons = LMnumberOfObjects(LM_xml);
  console.log(Npolygons);
  var NundeletedPolygons = 0;

  // Count undeleted objects:
  for(var ii=0; ii < Npolygons; ii++) {
    if(!parseInt(LMgetObjectField(LM_xml,ii,'deleted'))) {
      NundeletedPolygons++;
    }
  }
  
  // Get parts tree
  var tree = getPartsTree();
 if (threed_mt_mode != "box_label" && threed_mt_mode != "support_label") {//only has show selected object link
  // Create DIV
  html_str += '<b>Polygons in this image ('+ NundeletedPolygons +')</b>';

  // Create "hide all" button:
  if(IsHidingAllPolygons) {
    html_str += '<p style="font-size:10px;line-height:100%"><a id="show_all_button" href="javascript:ShowAllPolygons();">Show all polygons</a></p>';
  }
  else {
    IsHidingAllPolygons = false;
    html_str += '<p style="font-size:10px;line-height:100%"><a id="hide_all_button" href="javascript:HideAllPolygons();">Hide all polygons</a></p>';
  }
  if (IsHidingAllPlanes){
    html_str += '<p style="font-size:10px;line-height:100%"><a id="show_planes_button" href="javascript:ShowPlanes();">Show planes</a></p>';
  }else{
    html_str += '<p style="font-size:10px;line-height:100%"><a id="hide_all_planes_button" href="javascript:HideAllPlanes();">Hide all planes</a></p>';
  }if (IsHidingAllThreeD){
      html_str += '<p style="font-size:10px;line-height:100%"><a id="show_threed_button" href="javascript:ShowThreeD();">Show 3D scene</a></p>';
  }else{
    html_str += '<p style="font-size:10px;line-height:100%"><a id="hide_threed_button" href="javascript:HideThreeD();">Hide 3D scene</a></p>';
  }
}
if (threed_mt_mode != "support_label"){
  if (IsHidingAllButSelected){
          html_str += '<p style="font-size:10px;line-height:100%"><a id="show_all_cubes_button" href="javascript:ShowOtherObjects();">Show all 3D objects</a></p>';
  }else{
          html_str += '<p style="font-size:10px;line-height:100%"><a id="hide_all_but_selected_button" href="javascript:HideAllButSelected();">Hide all 3D objects but selected</a></p>';
  }
}
if (threed_mt_mode == "support_label"){
  if (IsHidingAllThreeD){
      html_str += '<p style="font-size:10px;line-height:100%"><a id="show_threed_button" href="javascript:ShowThreeD();">Show 3D scene</a></p>';
  }else{
    html_str += '<p style="font-size:10px;line-height:100%"><a id="hide_threed_button" href="javascript:HideThreeD();">Hide 3D scene</a></p>';
  }
}

  // Add parts-of drag-and-drop functionality:
  if(use_parts) {
    html_str += '<p style="font-size:10px;line-height:100%" ondrop="drop(event, -1)" ondragenter="return dragEnter(event)" ondragover="return dragOver(event)">Drag a tag on top of another one to create a part-of relationship.</p>';
  }

  html_str += '<ol>';
  
  // Show list (of non-deleted objects)
  for(var i=0; i < Npolygons; i++) {
    // get part level and read objects in the order given by the parts tree
    if (threed_mt_mode == 'box_label' && main_canvas.GetAnnoByID(i) && main_canvas.GetAnnoByID(i).GetType() != 3) continue;
	if(use_parts) {
      var ii = tree[0][i];
      var level = tree[1][i];
    }
    else {
      var ii = i;
      var level = 0;
    }
    
    var isDeleted = parseInt(LMgetObjectField(LM_xml,ii,'deleted'));
    var is_currently_shown = true;
    
    if(is_currently_shown && (((ii<num_orig_anno)&&((view_Existing&&!isDeleted)||(isDeleted&&view_Deleted))) || ((ii>=num_orig_anno)&&(!isDeleted||(isDeleted&&view_Deleted))))) {
      // change the left margin as a function of part level
      
	  html_str += '<div class="objectListLink" id="LinkAnchor' + ii + '" style="z-index:1; margin-left:'+ (level*1.5) +'em" ';
      
      if (use_parts) {
	// define drag events (but only if the tool is allowed to use parts)
	html_str += 
  'draggable="true" ondragstart="drag(event, '+ii+')" '+
	  'ondragend="dragend(event, '+ii+')" '+
	  'ondrop="drop(event, '+ii+')" '+
	  'ondragenter="return dragEnter(event)" '+
	  'ondragover="return dragOver(event)">';
      }
	else html_str += '>'
      
      // change the icon for parts
      if(level==0) {
	// if it is not a part, show square
	html_str += '<li>';
      }
      else {
	// if it is a part, use part style
	html_str += '<li class="children_tree">';
      }
      if ($(LM_xml).children("annotation").children("object").eq(ii).children("plane").length > 0 || $(LM_xml).children("annotation").children("object").eq(ii).children("cube").length > 0){
        html_str += '<a class="objectListLink"  id="Link' + ii + '" '+
      'href="javascript:main_threed_handler.AnnotationLinkClick('+ii+');" '+
      'onmouseover="main_threed_handler.AnnotationLinkMouseOver('+ii+');" ' +
      'onmouseout="main_threed_handler.AnnotationLinkMouseOut();" ';
      }else{
      // show object name: // else based on type of anno (get from anno list)
    html_str += '<a class="objectListLink"  id="Link' + ii + '" '+
  	'href="javascript:main_handler.AnnotationLinkClick('+ii+');" '+
  	'onmouseover="main_handler.AnnotationLinkMouseOver('+ii+');" ' +
  	'onmouseout="main_handler.AnnotationLinkMouseOut();" ';
      }
      if (use_parts) {
	html_str += 'ondrop="drop(event, '+ii+')" '+
	  'ondragend="dragend(event, '+ii+')" '+
	  'ondragenter="return dragEnter(event)" '+
	  'ondragover="return dragOver(event)"';

      }
      
      if(isDeleted) {
	html_str += ' style="color:#888888"><b>';
      }
      else {
	html_str += '>';
      }

      var obj_name = LMgetObjectField(LM_xml,ii,'name');
      if(obj_name.length==0 && !draw_anno) {
	html_str += '<i>[ Please enter name ]</i>';
      }
      else {
	html_str += obj_name;
      }
      
      if(isDeleted) html_str += '</b>';
      html_str += '</a>';

      var attributes = LMgetObjectField(LM_xml,ii,'attributes');
      if(attributes.length>0) {
	html_str += ' (' + attributes +')';
      }
      
      html_str += '</li></div>';
    }
  }
  
  html_str += '</ol><p><br/></p></div>';
  
  // Attach annotation list to 'anno_anchor' DIV element:
// document.getElementById("anno_anchor").innerHTML = html_str;
 $('#anno_anchor').append(html_str);
//	$(html_str).appendTo('#anno_anchor');
  /*for (var j = 0; j < Npolygons; j++){
     $(function() {
        $( "#Link" + j).draggable({
            drag: function(event, j) {drag(event, j); }
        });
    });
  }*/
	if (threed_mode == true && window.select){
		if (document.getElementById('Link' + window.select.ID)) document.getElementById('Link' + window.select.ID).style.color = '#FF0000';
	}
}


function RemoveObjectList() {
  $('#anno_list').remove();
}


function ChangeLinkColorBG(idx) {
  if(document.getElementById('Link'+idx)) {
    var isDeleted = parseInt($(LM_xml).children("annotation").children("object").eq(idx).children("deleted").text());
    if(isDeleted) document.getElementById('Link'+idx).style.color = '#888888';
    else document.getElementById('Link'+idx).style.color = '#0000FF';
    var anid = main_canvas.GetAnnoIndex(idx);

    // If we're hiding all polygons, then remove rendered polygon from canvas:
    if(IsHidingAllPolygons && main_canvas.annotations[anid].hidden) {
      main_canvas.annotations[anid].DeletePolygon();
    }
  }
}


function ChangeLinkColorFG(idx) {
  document.getElementById('Link'+idx).style.color = '#FF0000';
  var anid = main_canvas.GetAnnoIndex(idx);
  // If we're hiding all polygons, then render polygon on canvas:
  if(IsHidingAllPolygons && main_canvas.annotations[anid].hidden) {
    //main_canvas.annotations[idx].DrawPolygon(main_media.GetImRatio(), LMgetObjectField(LM_xml,idx,'x'), LMgetObjectField(LM_xml,idx,'y'));
    main_canvas.annotations[anid].RenderAnnotation('rest');
  }
}

function HideAllPolygons() {
  if(!edit_popup_open) {
    // Set global variable:
    IsHidingAllPolygons = true;
    
    // Delete all polygons from the canvas:
    for(var i = 0; i < main_canvas.annotations.length; i++) {
      main_canvas.annotations[i].DeletePolygon();
      main_canvas.annotations[i].hidden = true;
    }
    if (threed_mode){
        if (window.select){
          $("#container").css('display', 'block');
            $("#cnvs").css('display', 'block');
            $("#container").css('z-index', '1');
            $("#boxCanvas").css('display', 'block');
            if (window.select && (LMgetObjectField(LM_xml, window.select.ID, "ispartof")) && window.select.hparent == "unassigned"){
                CreatePolygonClip(LMgetObjectField(LM_xml, window.select.ID, "ispartof"));
            }
        hover_object = null;
        ThreeDHoverHighlight();
        if (IsHidingAllButSelected == true){
          IsHidingAllButSelected = false;
          RenderObjectList();
          main_threed_handler.GotoFirstAnnoObject();
          
        }
        
        }
      
      }
    
    // Create "show all" button:
    $('#hide_all_button').replaceWith('<a id="show_all_button" href="javascript:ShowAllPolygons();">Show all polygons</a>');
  }
  else {
    alert('Close edit popup bubble first');
  }
}

function ShowAllPolygons() {
  // Set global variable:
  IsHidingAllPolygons = false;

  // Render the annotations:
  main_canvas.UnhideAllAnnotations();
  main_canvas.RenderAnnotations();
  if (threed_mode){
    ClearCanvas();
    $("#container").css('display', 'none');
    $("#cnvs").css('display', 'none');
    $("#clipCanvas").css('display', 'none');
    $("#boxCanvas").css('display', 'none');
    $("#container").css('z-index', '-3');
  }

  // Create "hide all" button:
  $('#show_all_button').replaceWith('<a id="hide_all_button" href="javascript:HideAllPolygons();">Hide all polygons</a>');
}

// *******************************************
// Private functions:
// *******************************************

// DRAG FUNCTIONS

function drag(event, part_id) {
  // stores the object id in the data that is being dragged.
  if (threed_mt_mode == "box_label") return;
  console.log(event);
  if (ID_dict[part_id]) ThreeDHoverHighlight(ID_dict[part_id]);
  event.dataTransfer.effectAllowed = "all";
  event.dataTransfer.setData("Text", part_id);
  }


function dragend(event, object_id) {
  event.preventDefault();
  
  // Write XML to server:
  WriteXML(SubmitXmlUrl,LM_xml,function(){return;});
}

function dragEnter(event) {
  event.preventDefault();
  return true;
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event, object_id) {
  if (threed_mt_mode == "box_label") return;
  event.preventDefault();
  var part_id=event.dataTransfer.getData("Text");
  event.stopPropagation();
  var threed_is_position_possible = true;
  
  // modify part structure
  if(object_id!=part_id) { // messy but will be cleaned up
    if (threed_mode){
      if (main_canvas.GetAnnoByID(part_id).GetType() == 2 && main_canvas.GetAnnoByID(object_id).GetType() == 3){
        alert("You cannot assign a plane to a 3D box")
        return;
      }
      if (main_canvas.GetAnnoByID(part_id).GetType() == 2 && main_canvas.GetAnnoByID(object_id).GetType() == 2){
        alert("You cannot assign a plane to another plane");
        return;
      }
      if (main_canvas.GetAnnoByID(part_id).GetType() == 3 && (main_canvas.GetAnnoByID(object_id).GetType() == 1 || main_canvas.GetAnnoByID(object_id).GetType() == 0)){
        alert("You cannot assign a box to a polygon");
        return;
      }
      if (main_canvas.GetAnnoByID(part_id).GetType() == 3 && main_canvas.GetAnnoByID(object_id).GetType() == 2){
        threed_is_position_possible = CalculateBoxCanBeAdded(ID_dict[part_id], ID_dict[object_id]);
      }
      if (ID_dict[part_id] && threed_is_position_possible){
        addPart(object_id, part_id);
        SetDrawingMode(2);
        main_threed_handler.AssignSupportPlane(part_id, object_id);
        console.log(part_id);
		window.select = ID_dict[part_id];
		HighlightSelectedThreeDObject();
      }
    }
    if (threed_is_position_possible){
    addPart(object_id, part_id);
    RenderObjectList();
      if (threed_mode && !threed_mt_mode) document.getElementById('Link'+ part_id).style.color = '#FF0000';
    }else{
      alert("You cannot assign the box to that plane because it is impossible.")
    }
    // redraw object list
  }
}
