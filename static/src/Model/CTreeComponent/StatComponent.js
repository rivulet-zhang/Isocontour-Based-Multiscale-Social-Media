StatComponent = function(tweetsId, treeNode){
	this.tweetsId = tweetsId;
	this.treeNode = treeNode;
};

//normalized distribution;
//threshold is used to remove the cate which volume is lower than the threshold
//if threshold is not defined, then every cate is kept in the result

StatComponent.prototype.getDensity = function(){

	var area = this.treeNode.getArea();
	if(area <= 0)
		return 0;
	return this.getVolByCate(DataCenter.instance().focusCates) / area;

};

StatComponent.prototype.calCateDist = function(cates, threshold){

	if(userStudyController != null)
		return this.treeNode.cluster['category'];

	if(cates.length == 0)
		return {};

	var cateDup = [];
	this.tweetsId.forEach(function(id){
		cate = intersect_arrays( cates, Object.keys(DataCenter.instance().tweets[id].cate) );
		cateDup = cateDup.concat(cate);
	});
	
	//get distribution
	var dist = _.countBy(cateDup);

	//add entry for the cates that are 0
	DataCenter.instance().focusCates.forEach(function(cate){

		if(cate in dist)
			return;
		dist[cate] = 0;
	});

	var values =  _.values(dist);
	var sum = values.reduce(function(a, b) { return a + b; }, 0);
	if(sum <= 0)
		return dist;

	for(var c in dist){
		dist[c] = dist[c] / sum;
		//only remove those not equal to zero, but has low volume
		if( threshold !== null && threshold !== undefined && dist[c] < threshold && dist[c] > 0 ){
			console.log("remove low vol component:" + dist[c] + " " + sum);
			dist[c] = 0;
		}
	}

	return dist;
};


//get all keywords with its frequency which the cate of tweet is within the cates
StatComponent.prototype.getKeywordsFreqByCates = function(cates){

	var rst = [];

	this.tweetsId.forEach(function(id){
							if(DataCenter.instance().tweets[id] !== null ){

								var tweetCates = Object.keys(DataCenter.instance().tweets[id].cate);
								var inter = intersect_arrays(cates, tweetCates);

								if(inter.length > 0)
									rst = rst.concat(DataCenter.instance().tweets[id].keywords);
								//rst = rst.concat( Object.keys(DataCenter.instance().tweets[id].tokens) );
							}
						});

	return _.countBy(rst);

}

StatComponent.prototype.getVolByCate = function(cates){

	var cnt = 0;
	this.tweetsId.forEach(function(id){
							if(DataCenter.instance().tweets[id] !== null ){

								var tweetCates = Object.keys(DataCenter.instance().tweets[id].cate);
								var inter = intersect_arrays(cates, tweetCates);

								if(inter.length > 0)
									cnt++;
							}
						});

	return cnt;

}

StatComponent.prototype.getKeywordsTFIDFCates = function(cates){

	var rst = {};

	this.tweetsId.forEach(function(id){
							if(DataCenter.instance().tweets[id] !== null ){

								var tweetCates = Object.keys(DataCenter.instance().tweets[id].cate);
								var inter = intersect_arrays(cates, tweetCates);

								if(inter.length > 0){

									DataCenter.instance().tweets[id].keywords.forEach(function(val){

										if(!rst.hasOwnProperty(val))
											rst[val] = [];

										//for each word, store its tfidf value in the array;							
										rst[val].push(DataCenter.instance().tweets[id].tfidf[val]);

									});
								}
							}
						});

	//do not consider words with freq lower than thres
	var thres = 3;
	var keys = Object.keys(rst);

	keys.forEach(function(key){
		//calculate importance score based on both frequency and tf-idf;
		//the idea is reduce the score if the word appear very rearly;
		rst[key] =  rst[key].length > thres ? arrAvg(rst[key]) : Math.min(0.5, arrAvg(rst[key]));

	});

	return rst;

}


/**************************************keywords functions*****************************************/
StatComponent.prototype.getKeywords = function(cates, topK){
	
	//freq high --> importance high
	// var keywordsScore = this.getKeywordsFreqByCates(cates);
	var keywordsScore = this.getKeywordsTFIDFCates(cates);

	//no keywords due to thres filtering;
	if(Object.keys(keywordsScore).length === 0)
		return [];

	var keywords = Object.keys(keywordsScore);

	var sorted = keywords
						.filter(function(val){

							var tCates = DataCenter.instance().keywordAnalyzer.getCates(val);
							var inter = intersect_arrays(cates, tCates);
							return inter.length>0?true:false;
						})
						.sort(function(a,b){return keywordsScore[b]-keywordsScore[a]; });
	
	//if the current word is t(#t), then if #t(t) appears earlier, then remove the current word;
	sorted = sorted.filter(function(val, i){
		if(val.startsWith("#")){
			if(sorted.slice(0,i).indexOf(val.substring(1, val.length)) != -1 )
				return false;
			else
				return true;
		}
		else{
			if(sorted.slice(0,i).indexOf("#"+val) != -1 )
				return false;
			else
				return true;
		}
	});

	return sorted.length >= topK ? sorted.slice(0, topK) : sorted;

};


StatComponent.prototype.generateAndNormalizeCateAndColorForVis = function(){

	var selectedCate = DataCenter.instance().focusCates;

	var threshold = 0;
	var dist = this.calCateDist(selectedCate, threshold);
	var cateVol = selectedCate.map(function(val){ return dist[val]; });
	var cateColor = selectedCate.map(function(val, idx){ return divergentColorList()[idx] });

	//remove zero
	selectedCate = selectedCate.filter(function(val, i){ return cateVol[i] > 0 ? true : false; });
	cateColor = cateColor.filter(function(val, i){ return cateVol[i] > 0 ? true : false; });
	cateVol = cateVol.filter(function(val){ return val > 0 ? true : false; });

	if(cateVol.length <= 0)
		return null;

	var min = cateVol.min();
	//normalize the array based on the non-zero min value;
	cateVol = cateVol.map(function(val){ return Math.round(val / min); });

	return [cateVol, cateColor];

};


//calculate the distance between two vectors (atually two dist that has the same set of keys -- focusedCates);
//the distance should be in the range of [0,1]
StatComponent.vecDist = function(id1, id2){

	var dist1 = DataCenter.instance().getTree().getNodeById(id1).stat.calCateDist(DataCenter.instance().focusCates);
	var dist2 = DataCenter.instance().getTree().getNodeById(id2).stat.calCateDist(DataCenter.instance().focusCates);

	var sum = 0;
	for(var c in dist1)
		sum += Math.pow(dist1[c]-dist2[c], 2);
	return Math.sqrt(sum);

};

