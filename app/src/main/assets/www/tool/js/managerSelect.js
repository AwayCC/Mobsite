/**
 * Created by patrickchen on 2015/1/14.
 */
var manager = (manager) ? manager : {};
if(!manager.config){
   manager.config = {};
   console.warn("managerSelect : 'manager.js' is not loaded");
}
manager.initSelect = function(){
   var initObj = (function(){
      // Define selection mask
      var selectionMask = document.createElement("hr");
      selectionMask.className += "selectionMask";
      selectionMask.selectionMask = true;
      manager.config.listener.appendChild(selectionMask);
      // Helper functions
      var getParentSelectable = function(node, canReturnMe){
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
         return node;
      };
      var getFirstChildSelectable = function(node){
         if(!node){
            console.error("getFirstChildSelectable: node is null");
            return undefined;
         }
         return node.children[0];


      };
      var getPreviousSelectable = function(node){
         if(!node){
            console.error("getPreviousSelectable: node is null");
            return undefined;
         }

         while(node.previousElementSibling){
            if(node.previousElementSibling.selectable == null){
               node = node.previousElementSibling;
               continue;
            }
            return node.previousElementSibling;
         }
         console.warn("getPreviousSelectable: no previous selectable");
         return undefined;
      };
      var getNextSelectable = function(node){
         if(!node){
            console.error("getNextSelectable: node is null");
            return undefined;
         }
         while(node.nextElementSibling){
            if(node.nextElementSibling.selectable == null){
               node = node.nextElementSibling;
               continue;
            }
            return node.nextElementSibling;
         }
         console.warn("getNextSelectable: no next selectable");
         return undefined;
      };

      var assignSelection = function(o){
         if(manager.selectedObject){
            deselect();
         }
         var t = o.getBoundingClientRect();
         manager.selectedObjectRect = t;
         selectionMask.style.display = "none";
         selectionMask.style.top = (t.top + window.scrollY - manager.config.offsetY) + "px";
         selectionMask.style.left = (t.left + window.scrollX - manager.config.offsetX) + "px";
         selectionMask.style.display = "block";
         selectionMask.style.width = t.width + "px";
         selectionMask.style.height = t.height + "px";

         manager.selectedObject = o;
         Android.setSelectedHTML(o.htmlText);
         // TODO: add this to enable showing properties
         //if(showProperty != undefined){
         //   showProperty(o);
         //}

      };
      var deselect = function(){
         manager.selectedObject = undefined;
         selectionMask.style.display = "none";
      };
      var select = function(x, y,o){
         var t = document.elementFromPoint(x, y);
         if(!t){
            console.warn("Click: can't get object " + x + "," + y);
            deselect();
            return;
         }
         if(t == selectionMask)return;
         t = getParentSelectable(t, true);
         if(t){
            assignSelection(t);
            showProperty(t);
            Android.setSelectedHTML(t.innerHTML);
         }else{
            deselect();
         }
      };
      var swipeDown = function(){
         if(!manager.selectedObject)return;
         var g = getFirstChildSelectable(manager.selectedObject);
         if(g)assignSelection(g);
      };
      var swipeUp = function(){
         if(!manager.selectedObject)return;
         var g = getParentSelectable(manager.selectedObject);
         if(g)assignSelection(g);
      };
      var swipeLeft = function(){
         if(!manager.selectedObject)return;
         var g = getPreviousSelectable(manager.selectedObject);
         if(g)assignSelection(g);
      };
      var swipeRight = function(){
         if(!manager.selectedObject)return;
         var g = getNextSelectable(manager.selectedObject);
         if(g)assignSelection(g);
      };
      return {
         selectionMask      : selectionMask,
         onSingleTap        : select,
         onDoubleTap        : deselect,
         assignSelection    : assignSelection,
         on2FingerMoveDown  : swipeDown,
         on2FingerMoveLeft  : swipeLeft,
         on2FingerMoveUp    : swipeUp,
         on2FingerMoveRight : swipeRight,
         getParentSelectable: getParentSelectable
      }
   })();
   manager.selectedObjectRect = undefined;
   manager.selectedObject = undefined;
   manager.selectionMask = initObj.selectionMask;
   manager.getParentSelectable = initObj.getParentSelectable;
   manager.assignSelection = initObj.assignSelection;
   manager.config.onSingleTap = initObj.onSingleTap;
   manager.config.onDoubleTap = initObj.onDoubleTap;
   manager.config.on2FingerMoveDown = initObj.on2FingerMoveDown;
   manager.config.on2FingerMoveUp = initObj.on2FingerMoveUp;
   manager.config.on2FingerMoveLeft = initObj.on2FingerMoveLeft;
   manager.config.on2FingerMoveRight = initObj.on2FingerMoveRight;
};