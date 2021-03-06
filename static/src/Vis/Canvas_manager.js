Canvas_manager = function(){

	this.map_svg = null;

	this.cv = null;

};

Canvas_manager.prototype.init = function(map_div, map) {
	
	//init map svg;
	this.map_div = map_div;
	this.map = map;

	this.overlay = new OpenLayers.Layer.Vector("svg_canvas");
	this.map.addLayer(this.overlay);

	var div = d3.selectAll("#" + this.overlay.div.id);
    div.selectAll("svg").remove();
    this.map_svg = div.append("svg").attr("id", "map_svg");

    var width = $("#"+this.map_div.id).width();
    var height = $("#"+this.map_div.id).height();

    this.map_svg.attr("width", width)
    			.attr("height", height);

};

Canvas_manager.prototype.set_visibility = function(visible) {
	this.overlay.setVisibility(visible);
}

// Canvas_manager.prototype.get_lense_manager = function(){
// 	return this.topic_lense_manager;
// };

Canvas_manager.prototype.get_map = function(){
	return this.map;
};

Canvas_manager.prototype.geo_p_to_pixel_p = function(vec){

	var map = this.map;
	var pixel = map.getViewPortPxFromLonLat(new OpenLayers.LonLat(vec.x, vec.y).transform("EPSG:4326", "EPSG:900913"));
    var rst = new Vector2();
    rst.set(pixel.x, pixel.y);
    return rst;
};

Canvas_manager.prototype.pixel_p_to_geo_p = function(vec){

	var map = this.map;

    var lonlat = map.getLonLatFromPixel(vec);
	var lonlatTransf = lonlat.transform("EPSG:900913", "EPSG:4326");
	var rst = new Vector2();
    rst.set(lonlatTransf.lon, lonlatTransf.lat);
    return rst;
};

Canvas_manager.prototype.geo_bbox_to_pixel_bbox = function(geo_bbox){

	var min_lng = geo_bbox.center.x - Math.abs(geo_bbox.extents.x);
	var max_lng = geo_bbox.center.x + Math.abs(geo_bbox.extents.x);
	var min_lat = geo_bbox.center.y - Math.abs(geo_bbox.extents.y);
	var max_lat = geo_bbox.center.y + Math.abs(geo_bbox.extents.y);

	var bottom = this.geo_p_to_pixel_p({x:geo_bbox.center.x, y:min_lat}).y;
	var top = this.geo_p_to_pixel_p({x:geo_bbox.center.x, y:max_lat}).y;

	var left = this.geo_p_to_pixel_p({x:min_lng, y:geo_bbox.center.y}).x;
	var right = this.geo_p_to_pixel_p({x:max_lng, y:geo_bbox.center.y}).x;

	var pixel_bbox = new BBox();
	pixel_bbox.set_by_minmax( left, right, bottom, top );

	return pixel_bbox;
};

Canvas_manager.prototype.pixel_bbox_to_geo_bbox = function(pixel_bbox, pixel_tolerance){

	var min_x = pixel_bbox.center.x - Math.abs(pixel_bbox.extents.x);
	var max_x = pixel_bbox.center.x + Math.abs(pixel_bbox.extents.x);
	var min_y = pixel_bbox.center.y - Math.abs(pixel_bbox.extents.y);
	var max_y = pixel_bbox.center.y + Math.abs(pixel_bbox.extents.y);

	if( ! (pixel_tolerance === undefined) ){

		min_x -= pixel_tolerance;
		max_x += pixel_tolerance;
		min_y -= pixel_tolerance;
		max_y += pixel_tolerance;
	}

	var min_lat = this.pixel_p_to_geo_p({x:pixel_bbox.center.x, y:min_y}).y;
	var max_lat = this.pixel_p_to_geo_p({x:pixel_bbox.center.x, y:max_y}).y;

	var min_lng = this.pixel_p_to_geo_p({x:min_x, y:pixel_bbox.center.y}).x;
	var max_lng = this.pixel_p_to_geo_p({x:max_x, y:pixel_bbox.center.y}).x;

	var geo_bbox = new BBox();
	geo_bbox.set_by_minmax( min_lng, max_lng, min_lat, max_lat );

	return geo_bbox;
};


Canvas_manager.prototype.update = function(){

	// var cp_this = this;

	var left = $("#"+this.map_div.id).offset().left;
    var top = $("#"+this.map_div.id).offset().top;
    var width = $("#"+this.map_div.id).width();
    var height = $("#"+this.map_div.id).height();

    this.map_svg.attr("width", width)
        	.attr("height", height);

    if( this.cv == null)
    	return;

    this.cv.update();
    
};

Canvas_manager.prototype.add_region = function(bounds){

	//geo-bounds:
	var lngs = Object.keys( bounds ).map(function ( key ) { return bounds[key].x; });
	var lats = Object.keys( bounds ).map(function ( key ) { return bounds[key].y; });

	var min_lng = Math.min.apply( null, lngs );
	var max_lng = Math.max.apply( null, lngs );
	
	var min_lat = Math.min.apply( null, lats );
	var max_lat = Math.max.apply( null, lats );

	var geo_bbox = new BBox();
	geo_bbox.set_by_minmax( min_lng, max_lng, min_lat, max_lat);

	this.cv = new ContourVis(this.map_svg);

};

Canvas_manager.the_instace = null;

Canvas_manager.instance = function(){

	if(Canvas_manager.the_instace == null)
		Canvas_manager.the_instace = new Canvas_manager();
	return Canvas_manager.the_instace;

};