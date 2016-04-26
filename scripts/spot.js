/**
 *  file: spot.js
 *  author: samuel oosterhuis
 *
 * documentation standard: http://usejsdoc.org/
 *
 *  namespace mechanism from:
 *  http://stackoverflow.com/questions/881515/javascript-namespace-declaration
 *  			and
 *  http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/
 *
 **/
'use strict';

(function(spot_ns,$,undefined){
  spot_ns.test = "foobar";

  /**
   * Alchemy base class
   * @constructor
   * @param {string} name - the name of the element being created
     */
  spot_ns.Alchemy = function(name,idx){
    console.log( name + ":" + idx )
    this.name = name;
    this.idx = idx;
    spot_ns.Alchemy.list.push(this);
  };

  spot_ns.Alchemy.list = [];
  //spot_ns.Alchemy.counter = 0;


  spot_ns.Ing = function( name ){
    spot_ns.Alchemy.call(this,name,spot_ns.Ing.counter++);
  };
  spot_ns.Ing.prototype = Object.create(spot_ns.Alchemy.prototype);
  spot_ns.Ing.counter = 0;

  spot_ns.Eff = function( name ){
    spot_ns.Alchemy.call(this,name,spot_ns.Eff.counter++);
  };
  spot_ns.Eff.prototype = Object.create(spot_ns.Alchemy.prototype);
  spot_ns.Eff.counter = 0;

  spot_ns.Pot = function( name ){
    spot_ns.Alchemy.call(this,name,spot_ns.Pot.counter++);
  };
  spot_ns.Pot.prototype = Object.create(spot_ns.Alchemy.prototype);
  spot_ns.Pot.counter = 0;

  spot_ns.Mess = function() {
    console.log( "creating a new grouping");
    this.data = [];
  };

  spot_ns.Mess.prototype.mAdd = function(obj) {
    this.data.push(obj);
  };

  spot_ns.Mess.prototype.reIndex = function() {
    this.data.sort(function(a,b){return a.localeCompare(b);});
    var len = this.data.length;
    for(var i=0;i<len;i++){
      this.data[i].idx=i;
    }
  };


}( window.spot_ns = window.spot_ns || {}, jQuery ));


