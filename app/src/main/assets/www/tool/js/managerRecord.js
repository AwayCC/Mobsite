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
      var undoAction = function(act){

      };
      var redoAction = function(act){

      };
      var pushAction = function(act){

      };
      return {
         undoAction: undoAction,
         redoAction: redoAction,
         pushAction: pushAction
      };
   })();
   manager.undoAction = initObj.undoAction;
   manager.redoAction = initObj.redoAction;
   manager.pushAction = initObj.pushAction;
};