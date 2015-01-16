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
         var managedStyle = document.createElement("style");
         // WebKit hack :(
         managedStyle.appendChild(document.createTextNode(""));
         document.head.appendChild(managedStyle);

         managedStyle.sheet = (managedStyle.sheet) ? managedStyle.sheet : {};

         manager.managedStylesheet = managedStyle.sheet;
         manager.managedStylesheet.insertRule(".dragPlaceholder{display:none;}", 0);
         manager.placeholderStyle = manager.managedStylesheet.cssRules[0];

      })();
      var isDraggingSlide = false;
      var isDragging = false;
      manager.config.dragMoveTimeout = 100;
      var dragMoveCount = manager.config.dragMoveTimeout;
      var dragInterval = 1000;
      var dragSetTimeout;
      var cursorX, cursorY;
      var moveElement = function(o, ref){
         var c = ref;
         while(c.parentNode){
            if(c.parentNode == o){
               return false;
            }
            c = c.parentNode;
         }
         if(ref.parentNode){
            ref.parentNode.insertBefore(o, ref);
            return true;
         }
      };
      var resetTimeout = function(){
         dragSetTimeout = undefined;
         dragMoveCount = manager.config.dragMoveTimeout;
         if(isDragging){
            updateCursor(cursorX, cursorY);
         }
      };
      var showPlaceholder = function(){
         manager.placeholderStyle.style.display = "block";
      };
      var hidePlaceholder = function(){
         manager.placeholderStyle.style.display = "none";
      };
      var updateCursor = function(x, y){
         var t = document.elementFromPoint(x, y);
         if(manager.selectedObject.slide){
            if(!t.placeholder){
               return;
            }
            if(manager.Cursor.parentNode){
               manager.Cursor.parentNode.removeChild(manager.Cursor);
               return;
            }
         }else{
            if(t.placeholder){
               return;
            }
         }
         if(t.placeholder){
            t.appendChild(manager.Cursor);
            return;
         }
         t = manager.getParentSelectable(t, true);
         if(!t) return;
         var b = t.getBoundingClientRect();
         if(y > b.top + b.height / 2){
            // Insert after t
            t.parentNode.insertBefore(manager.Cursor, t.nextSibling);
         }else{
            // Insert Before t
            t.parentNode.insertBefore(manager.Cursor, t);
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
         var x = document.elementFromPoint(x, y);
         x = manager.getParentSelectable(x);
         if(x && x.slide == true){
            isDraggingSlide = true;
         }
         showPlaceholder();
      };
      var dragMove = function(x, y){
         cursorX = x;
         cursorY = y;
         if(!isDragging){
            return;
         }
         if(dragSetTimeout != undefined && dragMoveCount != 0){
            --dragMoveCount;
            return;
         }
         if(!dragSetTimeout){
            console.log("rest setTimeOut");
            dragSetTimeout = setTimeout(resetTimeout, dragInterval);
         }
         if(dragMoveCount == 0){
            console.log("reset Count");
            dragMoveCount = manager.config.dragMoveTimeout;
            clearTimeout(dragSetTimeout);
            dragSetTimeout = undefined;
         }
         updateCursor(x, y);
      };
      var dragEnd = function(){
         isDragging = false;
         hidePlaceholder();
         if(cursorX == undefined){
            return;
         }
         moveElement(manager.selectedObject, manager.Cursor);

         if(manager.Cursor.parentNode){
            manager.Cursor.parentNode.removeChild(manager.Cursor);
         }
         manager.assignSelection(manager.selectedObject);
         if(manager.selectedObject.hasAttribute("style")){
            manager.selectedObject.removeAttribute("style");
         }
      };
      return {
         onLongPressStart: dragStart,
         onLongPressMove : dragMove,
         onLongPressEnd  : dragEnd
      };
   })();

   // Define Cursor
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

   // NOTICE: manager.managedStyle is also defined in this file
   // NOTICE: manager.placeholderStyle is also defined in this file
   manager.config.onLongPressStart = initObj.onLongPressStart;
   manager.config.onLongPressMove = initObj.onLongPressMove;
   manager.config.onLongPressEnd = initObj.onLongPressEnd;
};