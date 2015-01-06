/**
 * Created by Home on 12/6/2014.
 */

// My manager class

var manager = {};
manager.canvasState = Object.freeze({
   "unselected": 0,
   "selected"  : 1,
   "dragging"  : 2
});
manager.state = manager.canvasState.unselected;
manager.selectedObject = null;
manager.Cursor = undefined;

/*
 * For these traversal functions below, parameter is a DOM object.
 */
manager.getParentSelectable = function(node, canReturnMe){
   if(!node){
      console.error("getParentSelectable: node is null");
      return undefined;
   }
   if(node && node.selectable != null && canReturnMe){
      return node;
   }
   do{
      node = node.parentNode;
      if(!node || node.id == "bd"){
         return undefined;
      }
   }while(!node.selectable);
   console.log("getParentSelectable:");
   console.log(node);
   return node;
};
manager.getFirstChildSelectable = function(node){
   if(!node){
      console.error("getFirstChildSelectable: node is null");
      return undefined;
   }
   console.log("getFirstChildSelectable:");
   console.log(node.children[0]);
   return node.children[0];


};
manager.getPreviousSelectable = function(node){
   if(!node){
      console.error("getPreviousSelectable: node is null");
      return undefined;
   }

   while(node.previousElementSibling){
      if(node.previousElementSibling.selectable != null){
         node = node.previousElementSibling;
         continue;
      }
      console.log("getPreviousSelectable:");
      console.log(node.previousElementSibling);
      return node.previousElementSibling;
   }
   console.log("getPreviousSelectable: no previous selectable");
   return undefined;
};
manager.getNextSelectable = function(node){
   if(!node){
      console.error("getNextSelectable: node is null");
      return undefined;
   }
   while(node.nextElementSibling){
      if(node.nextElementSibling.selectable != null){
         node = node.nextElementSibling;
         continue;
      }
      console.log("getNextSelectable:");
      console.log(node.nextElementSibling);
      return node.nextElementSibling;
   }
   console.log("getNextSelectable: no next selectable");
   return undefined;
};

/*
 * Below are some helper function.
 */
manager.addClass = function(node, text){
   if(node.className.indexOf(text) == -1){
      node.className = (node.className.length == 0) ? text : (node.className + " " + text);
   }
};
manager.removeClass = function(node, text){
   var n = node.className.indexOf(text);
   if(n != -1){
      if(node.className.length == text.length){
         node.className = "";
      }else if(n == 0){
         node.className = node.className.replace(text + " ", "");
      }else{
         node.className = node.className.replace(" " + text, "");
      }
   }
};
manager.deselect = function(){
   manager.removeClass(manager.selectedObject, "selected");
   manager.selectedObject = undefined;
   manager.state = manager.canvasState.unselected;
};
manager.assignSelection = function(o){
   console.log("assignSelection:");
   console.log(o);
   if(o == manager.selectedObject){
      return;
   } // Speed up the process.
   if(manager.selectedObject){
      manager.deselect();
   }
   manager.selectedObject = o;
   Android.setSelectedHTML(o.htmlText);
   manager.addClass(o, "selected");
   manager.state = manager.canvasState.selected;
};
manager.updateAccessible = function(x, y, o){
};
manager.updateCursorPosition = function(x, y){

};

/*
 * Below are several default event function hook
 * They represent how others may use the manager object
 */
manager.click = function(x, y){
   var t = document.elementFromPoint(x, y);
   if(!t){
      console.log("Click: can't get object " + x + "," + y);
      manager.deselect();
      return;
   }
   var rect = t.getBoundingClientRect();
   console.log(rect.top, rect.bottom, rect.left, rect.right, rect.height, rect.width);
   t = manager.getParentSelectable(t, true);
   if(t){
      manager.assignSelection(t);
   }else{
      manager.deselect();
   }
};
manager.doubleClick = function(x, y){

};
manager.dualSwipe = function(direction){
   // direction 1:up 2:down 3:left 4:right
   if(!manager.selectedObject) return;
   var g = undefined;
   switch(direction){
      case 1:
         g = manager.getParentSelectable(manager.selectedObject);
         break;
      case 2:
         g = manager.getFirstChildSelectable(manager.selectedObject);
         break;
      case 3:
         g = manager.getPreviousSelectable(manager.selectedObject);
         break;
      case 4:
         g = manager.getNextSelectable(manager.selectedObject);
         break;
   }
   if(g){
      manager.assignSelection(g);
   }
};


// Configuration for gestureListener
manager.config = {
   longPressThreshold   : 600,
   doubleTapThreshold   : 125,
   gestureCountThreshold: 10,
   onSingleTap          : manager.click,
   onDoubleTap          : manager.doubleClick,
   onLongPressStart     : function(){
   },
   onLongPressMove      : function(){
   },
   onLongPressEnd       : function(){
   },
   on2FingerMoveUp      : function(){
      manager.dualSwipe(1);
   },
   on2FingerMoveDown    : function(){
      manager.dualSwipe(2);
   },
   on2FingerMoveLeft    : function(){
      manager.dualSwipe(3);
   },
   on2FingerMoveRight   : function(){
      manager.dualSwipe(4);
   },
   onPinchIn            : function(){
   },
   onPinchOut           : function(){
   }
};


manager.initDrag = function(){
   var init = function(){
      // static objects
      var hoverObject = null;
      var hoverObjectOnTop = false;
      var hoverParents = [];

      // helper functions for dragging
      var initParentsAccessible = function(node){
      };
      var getHoverParentAccessible = function(node, canReturnMe){
         if(!node){
            console.error("getHoverParentAccessible: node is null");
            return undefined;
         }
         if(node.accessible != null && canReturnMe){
            return node;
         }
         do{
            node = node.parentNode;
            if(!node || node.id == "bd"){
               return undefined;
            }
         }while(!node.accessible);
         console.log("getHoverParentAccessible:");
         console.log(node);
         return node;
      };

      // function hooks definiton
      var setCursor = function(){
         // TODO: Not that easy... The accessible item and the floating item should be taken into account
         if(same) return;
         if(hoverObject.accessible){
            hoverObject.appendChild(manager.Cursor);
         }else{
            if(hoverObjectOnTop){
               hoverObject.parentNode.insertBefore(manager.Cursor, hoverObject);
            }else{
               hoverObject.parentNode.insertBefore(manager.Cursor, hoverObject.nextSibling);
            }
         }
      };
      var clearCursor = function(){
         if(manager.Cursor && manager.Cursor.parentNode){
            manager.Cursor.parentNode.removeChild(manager.Cursor);
         }
      };
      var updateHoverParentAccessible = function(node){

      };
      var updateCursor = function(x, y){
         var d = document.elementFromPoint(x, y);
         var s = d.getBoundingClientRect();

         var dTop = (y < s.top + s.height / 2);
         if(d == hoverObject && dTop == hoverObjectOnTop){
            return false; // Do Nothing
         }else{
            hoverObject = d;
            hoverObjectOnTop = dTop;
            return true;
         }
      };
      var dragStart = function(){
      };
      var dragMove = function(x, y){
         $("#x")[0].innerHTML = x;
         $("#y")[0].innerHTML = y;
      };
      var dragEnd = function(){
         var i = hoverParents.length;
         for(var j = 0; j < i; ++j){
            hoverParents.pop();
         }
         hoverObject = null;
         hoverObjectOnTop = false;
      };

      return {
         setCursor                  : setCursor,
         clearCursor                : clearCursor,
         updateHoverParentAccessible: updateHoverParentAccessible,
         updateCursor               : updateCursor,
         dragStart                  : dragStart,
         dragMove                   : dragMove,
         dragEnd                    : dragEnd
      };
   };
   // Define cursor
   var para = document.createElement("div");
   var para_br = document.createElement("br");
   para.appendChild(para_br);
   para.style.backgroundColor = "blue";
   para.style.fontSize = "3px";
   para.className = "col-md-12";
   para.style.margin = "2px";
   manager.Cursor = para;

   // Assign function to drag function family
   var tempDragObject = init();
   manager.setCursor = tempDragObject.setCursor;
   manager.updateCursorPosition = tempDragObject.updateCursor;

   // Configure manager.config to enable dragging
   manager.config.onLongPressStart = tempDragObject.dragStart;
   manager.config.onLongPressMove = tempDragObject.dragMove;
   manager.config.onLongPressEnd = tempDragObject.dragEnd;
};

manager.init = function(){
   window.isMouseDown = false;
   manager.state = manager.canvasState.unselected;
   var m = document.getElementsByTagName("img");
   for(var i =0;i<m.length;++i){
      m[i].src = "www/"+m[i].src;
   }

   // Add some attributes to DOM element
   var selectableObjects = document.querySelectorAll(".selectable");
   for(var i = 0; i<selectableObjects.length;++i){
      selectableObjects[i].selectable = true;
   }
   //$.each($(".selectable"), function(i, val){
   //   val.selectable = true;
   //});
   //$.each($(".column"), function(i, val){
   //   val.accessible = true;
   //});
   //$.each($(".slide"), function(i, val){
   //   val.accessible = true;
   //});

   // Define my own event listener
   window.onkeypress = function(e){
      if(e.keyCode < 105 || e.keyCode > 108){
         return;
      }
      switch(e.keyCode){
         case 105: //i
            manager.dualSwipe(1);
            break;
         case 107: //k
            manager.dualSwipe(2);
            break;
         case 106: //j
            manager.dualSwipe(3);
            break;
         case 108: //l
            manager.dualSwipe(4);
            break;
      }
   };
};