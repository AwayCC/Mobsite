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
      manager.config.maxActionStackLength = 10;
      var maxActionStackLength = manager.config.maxActionStackLength;
      var currentPointer = maxActionStackLength;
      var maximumPointer = currentPointer;
      var validateAction = function(act){
         return true;
      };
      var execAction = function(act){
         console.log(actionStack);
         console.log(currentPointer);
         console.log(maximumPointer);
      };
      var reverseAction = function(act){
      };
      var undoAction = function(){
         if(currentPointer - 1 == maximumPointer ||
            (currentPointer == 0 && maximumPointer == maxActionStackLength)){
            console.log("undoAction: Reach undo maximum");
            return;
         }
         var c = currentPointer;
         currentPointer = (currentPointer == 0) ? maxActionStackLength : currentPointer - 1;
         reverseAction(actionStack[c]);
      };
      var redoAction = function(){
         if(currentPointer == maximumPointer){
            console.log("redoAction: Reach redo maximum");
            return;
         }
         currentPointer = (maxActionStackLength) ? 0 : currentPointer + 1;
         execAction(actionStack[currentPointer]);
      };
      var pushAction = function(act){
         if(!validateAction(act)){
            console.log("Action is of wrong definition");
            return;
         }
         if(currentPointer == maxActionStackLength){
            currentPointer = 0;
         }
         actionStack[currentPointer] = act;
         maximumPointer = currentPointer;
         execAction(act);
      };
      var reInitActionStack = function(num){
         actionStack = [];
         if(!num){
            maxActionStackLength = manager.config.maxActionStackLength;
         }else{
            maxActionStackLength = num;
         }
         currentPointer = maxActionStackLength;
         maximumPointer = currentPointer;
      };
      return {
         undoAction       : undoAction,
         redoAction       : redoAction,
         pushAction       : pushAction,
         reInitActionStack: reInitActionStack
      };
   })
   ();
// NOTICE: manager.config.maxActionStackLength is defined above.
   manager.undoAction = initObj.undoAction;
   manager.redoAction = initObj.redoAction;
   manager.pushAction = initObj.pushAction;
   manager.reInitActionStack = initObj.reInitActionStack;
}
;