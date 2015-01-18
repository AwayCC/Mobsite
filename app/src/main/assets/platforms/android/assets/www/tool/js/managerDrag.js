/**
 * Created by patrickchen on 2015/1/17.
 */

var manager = (manager) ? manager : {};
if(!manager.config){
   manager.config = {};
   console.warn("managerDrag : 'manager.js' is not loaded");
}
manager.initDrag = function(){
   var initObj = (function(){
      var isDraggingSlide = false;
      var isDragging = false;
      var windowH = window.innerHeight;
      manager.config.dragMoveTimeout = 100;
      var dragMoveCount = manager.config.dragMoveTimeout;
      var dragInterval = 500;
      var dragSetTimeout, dragSetInterval;
      var cursorX, cursorY;
      var scroll = function(){
         if(cursorY < 100 && window.scrollY > 10){
            window.scrollTo(window.scrollX, window.scrollY - 10);
         }else if(cursorY > windowH - 100 && window.scrollY < windowH - 10){
            window.scrollTo(window.scrollX, window.scrollY + 10);

         }
      };
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
         //manager.placeholderStyle.style.display = "block";
      };
      var hidePlaceholder = function(){
         //manager.placeholderStyle.style.display = "none";
      };
      var updateCursor = function(x, y){
         var t = document.elementFromPoint(x, y);
         if(t.column){
            return;
         }else if(t.slide){
            var v = manager.selectedObject;
            if(v.slide){
               if(v.placeholder){
                  // placeholder for slide
               }else{
                  // slide
               }
            }else{
               // column and others
               while(t && !t.slide){
                  t = t.parentNode;
               }
            }
         }else{
            if(t.column){
               t.insertBefore(manager.Cursor, undefined);
               return;
            }else if(t.slide){
               return;
            }else{

            }
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

      var dragStart = function(x, y, o){
         if(!o){
            // Drag from innerContent
            if(!manager.selectedObject){
               return;
            }
            Android.startDrag();
            if(x < manager.selectedObjectRect.left ||
               x > manager.selectedObjectRect.left + manager.selectedObjectRect.width ||
               y < manager.selectedObjectRect.top ||
               y > manager.selectedObjectRect.top + manager.selectedObjectRect.height){
               // Not in boundingClientRect
               return;
            }
            o = manager.selectedObject;
         }else{
            // Drag from clipboard or element repo
            manager.config.onDoubleTap();
            manager.selectedObject = o;
         }
         isDragging = true;
         manager.selectionMask.style.display = "none";
         manager.selectedObject.dragging = manager.selectedObject.style.opacity;
         if(manager.selectedObject.dragging == ""){
            manager.selectedObject.dragging = -1;
         }
         manager.selectedObject.style.opacity = "0.4";
         dragSetInterval = setInterval(scroll, 50);
         o = manager.getParentSelectable(o);
         if(o && o.slide == true){
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
            dragSetTimeout = setTimeout(resetTimeout, dragInterval);
         }
         if(dragMoveCount == 0){
            dragMoveCount = manager.config.dragMoveTimeout;
            clearTimeout(dragSetTimeout);
            dragSetTimeout = undefined;
         }
         updateCursor(x, y);
      };
      var dragEnd = function(){
         if(!isDragging){
            return;
         }
         clearInterval(dragSetInterval);
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
         if(manager.selectedObject.dragging){
            if(manager.selectedObject.dragging != -1){
               manager.selectedObject.style.opacity = manager.selectedObject.dragging;
            }else{
               manager.selectedObject.style.removeProperty("opacity");
            }
            manager.selectedObject.dragging = null;
         }
      };
      return {
         onLongPressStart: dragStart,
         onLongPressMove : dragMove,
         onLongPressEnd  : dragEnd,
         moveElement     : moveElement
      };
   })();

   // Define Cursor
   (function(){
      var para = document.createElement("div");
      var para_br = document.createElement("br");
      para.appendChild(para_br);
      para.className = "cursorStyle";
      manager.Cursor = para;
   })();

   // NOTICE: manager.managedStyle is also defined in this file
   // NOTICE: manager.placeholderStyle is also defined in this file
   manager.config.onLongPressStart = initObj.onLongPressStart;
   manager.config.onLongPressMove = initObj.onLongPressMove;
   manager.config.onLongPressEnd = initObj.onLongPressEnd;
};