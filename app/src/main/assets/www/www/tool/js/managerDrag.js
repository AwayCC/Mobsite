/**
 * Created by patrickchen on 2015/1/14.
 */
var manager = (manager) ? manager : {};
if(!manager.config){
   manager.config = {};
   console.warn("managerDrag : 'manager.js' is not loaded");
}
manager.initDrag = function(){
   var initObj = (function(){
      var isDragging = false;
      var dragStart = function(x,y){
         var t = document.elementFromPoint(x,y);
         if(t == manager.selectionMask){
            isDragging = true;
         }else{
            return;
         }

      };
      var dragMove = function(x,y){
      };
      var dragEnd = function(){

      };
      return {
         onLongPressStart: dragStart,
         onLongPressMove : dragMove,
         onLongPressEnd  : dragEnd
      };
   })();
   manager.config.onLongPressStart = initObj.onLongPressStart;
   manager.config.onLongPressMove = initObj.onLongPressMove;
   manager.config.onLongPressEnd = initObj.onLongPressEnd;
};