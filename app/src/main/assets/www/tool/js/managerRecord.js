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
         resizeActionStack: resizeStack,
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
      manager.setProperty(myAttr, myNewValue, myOldValue);
   };
   var undo = function(){
      manager.setProperty(myAttr, myOldValue, myNewValue);
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

