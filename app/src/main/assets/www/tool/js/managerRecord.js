/**
 * Created by patrickchen on 2015/1/18.
 */
var manager = (manager) ? manager : {};
if(!manager.config){
   manager.config = {};
   console.warn("managerRecord : 'manager.js' is not loaded");
}
manager.initRecord = function(){
   var initObj = (function(){
      var actionStack = [];
      var actions = [];
      manager.config.maxActionStackLength = 10;
      var maxActionStackLength = manager.config.maxActionStackLength;
      var currentPointer = 0, maxPointer = 0, minPointer = 0;
      var registerAction = function(act){
         if(!act.type || !act.execFunction || !act.undoFunction || !act.redoFunction){
            console.log("Register action failed.");
            return;
         }
         actions.push(act);
      };
      var exec = function(act){
         for(var i in actions){
            if(actions[i].type == act.type){
               actions[i].execFunction();
               return;
            }
         }
         console.log("wrong type");
      };
      var redo = function(act){
         for(var i in actions){
            if(actions[i].type == act.type){
               actions[i].redoFunction();
               return;
            }
         }
         console.log("wrong type");
      };
      var undo = function(act){
         for(var i in actions){
            if(actions[i].type == act.type){
               actions[i].undoFunction();
               return;
            }
         }
         console.log("wrong type");
      };
      var undoAction = function(){
         if(currentPointer == minPointer){
            console.log("Reach undo maximum");
            return;
         }
         actionStack[currentPointer].undoFunction();
         currentPointer = (currentPointer + maxActionStackLength - 1) % maxActionStackLength;
      };
      var redoAction = function(){
         if(currentPointer == maxPointer){
            console.log("Reach redo maximum");
            return;
         }
         currentPointer = (++currentPointer) % maxActionStackLength;
         actionStack[currentPointer].redoFunction();
      };
      var pushAction = function(act){
         currentPointer = (++currentPointer) % maxActionStackLength;
         if(currentPointer == minPointer){
            minPointer++;
         }
         maxPointer = currentPointer;
         actionStack[currentPointer] = act;
         actionStack[currentPointer].execFunction();
      };
      var resizeStack = function(num){
         actionStack = [];
         if(!num){
            maxActionStackLength = manager.config.maxActionStackLength;
         }else{
            manager.maxActionStackLength = maxActionStackLength = num;
         }
         actionStack.length = maxActionStackLength;

         currentPointer = 0;
         maxPointer = 0;
         minPointer = 0;
      };

      return {
         undoAction       : undoAction,
         redoAction       : redoAction,
         pushAction       : pushAction,
         resizeActionStack: resizeStack
      };
   })();
// NOTICE: manager.config.maxActionStackLength is defined above.

   manager.undoAction = initObj.undoAction;
   manager.redoAction = initObj.redoAction;
   manager.pushAction = initObj.pushAction;
   manager.resizeActionStack = initObj.resizeActionStack;
   manager.resizeActionStack(10);

};
manager.action = {};
manager.action.setProperty = function(obj, attr, oldValue, newValue){
   var myAttr = attr, myOldValue = oldValue, myNewValue = newValue;
   var exec = function(){
      manager.setProperty(myAttr, myNewValue, obj);
   };
   var undo = function(){
      manager.setProperty(myAttr, myOldValue, obj);
   };
   manager.pushAction(
      {
         type        : "setProperty",
         execFunction: exec,
         redoFunction: exec,
         undoFunction: undo
      }
   );
};
manager.action.addElement = function(obj, ref, callback){
   var myObj = obj, myRef = ref, myCallback = callback;
   var isRefParentPlaceholder;
   var exec = function(){
      if(myRef.parentNode){
         if(myRef.parentNode.placeholder){
            var x = myRef.parentNode.parentNode;
            x.removeChild(myRef.parentNode);
            isRefParentPlaceholder = true;
            x.appendChild(myObj);
            myRef.parentNode.removeChild(myRef);
         }else{
            var x = myRef.parentNode;
            x.insertBefore(myObj, myRef);
            x.removeChild(myRef);
         }
         if(myCallback){
            myCallback();
         }
      }else{
         console.log("addElement: ref has no parentNode");
      }
   };
   var undo = function(){
      if(isRefParentPlaceholder){
         var g = manager.createDummy();
         var x = manager.createPlaceholder();
         x.appendChild(g);
         if(myObj.parentNode){
            myObj.parentNode.insertBefore(x, myObj);
            myObj.parentNode.removeChild(myObj);
            myRef = g;
            if(myObj == manager.selectedObject){
               manager.config.onDoubleTap();
            }
         }else{
            console.log("addElement: uedo failed");
         }
      }else{
         if(myObj.parentNode){
            var g = manager.createDummy();
            myObj.parentNode.insertBefore(g, myObj);
            myObj.parentNode.removeChild(myObj);
            myRef = g;
            if(myObj == manager.selectedObject){
               manager.config.onDoubleTap();
            }
         }else{
            console.log("addElement: uedo failed");
         }
      }

   };
   manager.pushAction(
      {
         type        : "addElement",
         execFunction: exec,
         redoFunction: exec,
         undoFunction: undo
      }
   );
};
manager.action.deleteElement = function(obj, callback){
   if(!myObj){
      return;
   }
   var myObj = obj, myRef = null, myCallback = callback, isAddPlaceholder = false;
   var exec = function(){
      if(myObj.parentNode){
         if(myObj.parentNode.column){
            var count = 0;
            for(var i in myObj.parentNode.children){
               if(myObj.parentNode.children[i].dummy != true){
                  ++count;
               }
            }
            if(count == 1){
               // Add placeholder
               isAddPlaceholder = true;
               var g = manager.createDummy();
               myRef = manager.createPlaceholder();
               myRef.appendChild(g);
               myObj.parentNode.insertBefore(myRef, myObj);
               myObj.parentNode.removeChild(myObj);
               manager.config.onDoubleTap();
               return;
            }
         }
         var g = manager.createDummy();
         myObj.parentNode.insertBefore(g, myObj);
         myObj.parentNode.removeChild(myObj);
         myRef = g;
         if(myObj == manager.selectedObject){
            manager.config.onDoubleTap();
         }
      }else{
         console.log("deleteElement failed");
      }
   };
   var undo = function(){
      if(myRef.parentNode){
         myRef.parentNode.insertBefore(myObj, myRef);
         myRef.parentNode.removeChild(myRef);
      }else{
         console.log("deleteElement undo failed");
      }
   };
   var redo = function(){
      if(myObj.parentNode){
         myObj.parentNode.insertBefore(myRef, myObj);
         myRef.parentNode.removeChild(myObj);
      }else{
         console.log("deleteElement redo failed");
      }
   };
   manager.pushAction(
      {
         type        : "deleteElement",
         execFunction: exec,
         undoFunction: undo,
         redoFunction: redo
      }
   );
};
manager.action.moveElement = function(){

};
/*
 //moveElement(manager.selectedObject, manager.Cursor);
 var moveact =
 {
 type       : 'move',
 target     : manager.selectedObject,
 destination: manager.Cursor,
 start      : startPoint
 };
 manager.pushAction(moveact);
 moveElement(manager.selectedObject, manager.Cursor);
 * */
