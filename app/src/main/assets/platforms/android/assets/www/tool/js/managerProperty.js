/**
 * Created by patrickchen on 2015/1/14.
 */
var manager = (manager) ? manager : {};
if(!manager.config){
   manager.config = {};
   console.warn("managerProperty : 'manager.js' is not loaded");
}
manager.initProperty = function(){
   var initObj = (function(){
      var setAttribute = function(attr, value, o){
         var obj = (o) ? o : ((manager.selectedObject) ? manager.selectedObject : undefined);
         if(!obj){
            console.log("setAttribute: element not specified.");
            return;
         }
         switch(attr){
            case "text-size":
            case "src":
            case "font":
            case "background-color":
            case "background-image":
            case "color":
            case "text":
            case "opacity":
         }
      };
      var getAttribute = function(attr){

      };
      return {
         setAttribute: setAttribute,
         getAttribute: getAttribute
      };
   })();
   manager.setAttribute = initObj.setAttribute;
   manager.getAttribute = initObj.getAttribute;
   manager.setContent = initObj.setContent;
};