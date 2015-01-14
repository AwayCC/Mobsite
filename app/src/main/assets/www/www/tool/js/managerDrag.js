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
      // Add CSS rule
      (function(){
         var style = document.createElement("style");
         // WebKit hack :(
         style.appendChild(document.createTextNode(""));
         document.head.appendChild(style);

         style.sheet.insertRule(".dragPlaceholder{display:none;}");

      })();

      var isDragging = false;
      var dragMoveCount = 10;
      var dragInterval = 1000;
      var dragSetTimeout;
      var resetTimeout = function(){
         dragSetTimeout = undefined;
         dragMoveCount = 10;
      };
      var showPlaceholder = function(){

      };
      var hidePlaceholder = function(){

      };
      var updateCursor = function(x, y){
         var t = document.elementFromPoint(x, y);
         if(t.placeholder == true){
            t.appendChild(manager.cursor);
            return;
         }
         t = manager.getParentSelectable(t, true);
         if(!t) return;
         var b = t.getBoundingClientRect();
         if(y > b.top + b.height / 2){
            // Insert after t
         }else{
            // Insert Before t
         }
      };

      var dragStart = function(x, y){
         var t = document.elementFromPoint(x, y);
         if(t != manager.selectionMask){
            return;
         }
         isDragging = true;
         manager.selectionMask.style.display = "none";
         manager.selectedObject.style.opacity = "0.4";
         showPlaceholder();
      };
      var dragMove = function(x, y){
         if(!isDragging){
            return;
         }
         if(dragSetTimeout != undefined && dragMoveCount != 0){
            --dragMoveCount;
            return;
         }
         if(!dragSetTimeout){
            dragSetTimeout = setTimeout(resetTimeout, dragInterval);
         }
         if(dragMoveCount == 0){
            dragMoveCount = 10;
            clearTimeout(dragSetTimeout);
            dragSetTimeout = undefined;
         }
         updateCursor(x, y);
      };
      var dragEnd = function(){
         isDragging = false;
         hidePlaceholder();
         if(manager.cursor.parentNode){
            manager.cursor.parentNode.removeChild(manager.cursor);
         }
         manager.assignSelection(manager.selectedObject);
         manager.selectedObject.style.opacity = "1";

      };
      return {
         onLongPressStart: dragStart,
         onLongPressMove : dragMove,
         onLongPressEnd  : dragEnd
      };
   })();

   // Define cursor
   (function(){
      var para = document.createElement("div");
      var para_br = document.createElement("br");
      para.appendChild(para_br);
      para.style.backgroundColor = "blue";
      para.style.fontSize = "3px";
      para.className = "col-md-12";
      para.style.margin = "2px";
      manager.Cursor = para;
   })();

   manager.config.onLongPressStart = initObj.onLongPressStart;
   manager.config.onLongPressMove = initObj.onLongPressMove;
   manager.config.onLongPressEnd = initObj.onLongPressEnd;
};