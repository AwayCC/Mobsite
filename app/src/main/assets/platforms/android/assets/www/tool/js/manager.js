/**
 * Created by patrickchen on 2015/1/14.
 * Dependencies:
 *    Select
 *       Drag
 *       Property
 *          Record
 */
var manager = {};
// Configuration for gestureListener
manager.config = {
   listener             : document.getElementById("innercontent"),
   longPressThreshold   : 600,
   doubleTapThreshold   : 125,
   gestureCountThreshold: 5,
   onSingleTap          : function(){
   },
   onDoubleTap          : function(){
   },
   onLongPressStart     : function(){
   },
   onLongPressMove      : function(){
   },
   onLongPressEnd       : function(){
   },
   on2FingerMoveUp      : function(){
   },
   on2FingerMoveDown    : function(){
   },
   on2FingerMoveLeft    : function(){
   },
   on2FingerMoveRight   : function(){
   },
   onPinchIn            : function(){
   },
   onPinchOut           : function(){
   }
};
manager.preLoad = function(){
   // TODO : Do something that should be done before any initiation.
   var elements = document.getElementById("innercontent").getElementsByTagName("*");
   for(var i = elements.length - 1; i >= 0; --i){
      var e = elements[i];
      switch(e.tagName.toLowerCase()){
         case "br":
         case "span":
         case "hr":
         case "script":
         case undefined:
         case null:
            break;
         default :
            if(!e.hasAttribute("data-not-selectable")){
               e.selectable = true;
               break;
            }
            if(e.hasAttribute("data-placeholder")){
               e.placeholder = true;
               break;
            }

      }
      if(e.id.substr(0, 5) == "slide"){
         e.slide = true;
      }
   }
};

manager.init = function(){
   manager.preLoad();

   if(manager.initSelect){
      manager.initSelect();
   }
   if(manager.initDrag){
      manager.initDrag();
   }
   if(manager.initProperty){
      manager.initProperty();
   }
   if(manager.initRecord){
      manager.initRecord();
   }
   setGestureListener(manager.config);
};

