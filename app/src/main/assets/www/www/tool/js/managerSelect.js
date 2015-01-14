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
      document.body.appendChild(selectionMask);
      console.log("initSelect: Add selection mask.")
      console.log(selectionMask);
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
         console.log("getParentSelectable:");
         console.log(node);
         return node;
      };
      var getFirstChildSelectable = function(node){
         if(!node){
            console.error("getFirstChildSelectable: node is null");
            return undefined;
         }
         console.log("getFirstChildSelectable:");
         console.log(node.children[0]);
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
            console.log("getPreviousSelectable:");
            console.log(node.previousElementSibling);
            return node.previousElementSibling;
         }
         console.log("getPreviousSelectable: no previous selectable");
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
            console.log("getNextSelectable:");
            console.log(node.nextElementSibling);
            return node.nextElementSibling;
         }
         console.log("getNextSelectable: no next selectable");
         return undefined;
      };

      var assignSelection = function(o){
         console.log("assignSelection:");
         console.log(o);
         if(o == manager.selectedObject){
            return;
         } // Speed up the process.
         if(manager.selectedObject){
            deselect();
         }
         var t = o.getBoundingClientRect();
         selectionMask.style.display = "none";
         selectionMask.style.top = (t.top + window.scrollY) + "px";
         selectionMask.style.left = (t.left + window.scrollX) + "px";
         selectionMask.style.display = "block";
         selectionMask.style.width = t.width + "px";
         selectionMask.style.height = t.height + "px";

         manager.selectedObject = o;
         Android.setSelectedHTML(o.htmlText);

      };
      var deselect = function(){
         manager.selectedObject = undefined;
         selectionMask.style.display = "none";
      };
      var select = function(x, y){
         var t = document.elementFromPoint(x, y);
         if(!t){
            console.log("Click: can't get object " + x + "," + y);
            deselect();
            return;
         }
         if(t == selectionMask)return;
         t = getParentSelectable(t, true);
         if(t){
            assignSelection(t);
         }else{
            deselect();
         }
      };
      var swipeDown = function(){
         if(!manager.selectedObject)return;
         var g= getFirstChildSelectable(manager.selectedObject);
         if(g)assignSelection(g);
      };
      var swipeUp = function(){
         if(!manager.selectedObject)return;
         var g= getParentSelectable(manager.selectedObject);
         if(g)assignSelection(g);
      };
      var swipeLeft = function(){
         if(!manager.selectedObject)return;
         var g= getPreviousSelectable(manager.selectedObject);
         if(g)assignSelection(g);
      };
      var swipeRight = function(){
         if(!manager.selectedObject)return;
         var g= getNextSelectable(manager.selectedObject);
         if(g)assignSelection(g);
      };
      return {
         onSingleTap    : select,
         onDoubleTap    : deselect,
         assignSelection : assignSelection,
         on2FingerMoveDown : swipeDown,
         on2FingerMoveLeft : swipeLeft,
         on2FingerMoveUp : swipeUp,
         on2FingerMoveRight : swipeRight
      }
   })();
   manager.selectedObject = undefined;
   manager.assignSelection = initObj.assignSelection;
   manager.config.onSingleTap = initObj.onSingleTap;
   manager.config.onDoubleTap = initObj.onDoubleTap;
   manager.config.on2FingerMoveDown = initObj.on2FingerMoveDown;
   manager.config.on2FingerMoveUp = initObj.on2FingerMoveUp;
   manager.config.on2FingerMoveLeft = initObj.on2FingerMoveLeft;
   manager.config.on2FingerMoveRight = initObj.on2FingerMoveRight;
};