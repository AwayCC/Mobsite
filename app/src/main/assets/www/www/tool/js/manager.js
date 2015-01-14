/**
 * Created by patrickchen on 2015/1/14.
 * Dependencies:
 *    Select
 *       Drag
 *       Property
 *          Record
 */
var manager = {};
manager.preLoad = function(){
   // TODO : Do something that should be done before any initiation.
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
};

// Configuration for gestureListener
manager.config = {
   listener             : document.getElementById("innerContent"),
   longPressThreshold   : 600,
   doubleTapThreshold   : 125,
   gestureCountThreshold: 10,
   onSingleTap          : function(){},
   onDoubleTap          : function(){},
   onLongPressStart     : function(){},
   onLongPressMove      : function(){},
   onLongPressEnd       : function(){},
   on2FingerMoveUp      : function(){},
   on2FingerMoveDown    : function(){},
   on2FingerMoveLeft    : function(){},
   on2FingerMoveRight   : function(){},
   onPinchIn            : function(){},
   onPinchOut           : function(){}
};