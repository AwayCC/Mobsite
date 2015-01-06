
var tool = false;
var pos = false;
var scwidth;
var scheight;
var controlpro;
var header;
var footer;
var terheight;
var ter = false;
var proper;
var addpanelshow = false;
var onanimate = false;
var settingshow = false;
var controlpanelshow = false;
jQuery(document).ready(function($){
    var freeBounds = document.getElementById('propertypanel');
    $("#innercontent").first().load("./www/index.html");
    $("#Addmenu").first().load("./elements.html");
    scwidth=document.body.clientWidth;
    scheight=document.body.clientHeight;
    EnvironmentInit();
});
function test(){
    var rect = $("#header")[0].getBoundingClientRect();
    alert(rect.width);
    return true;
};
function AddPanelShow()
{
    if(!onanimate)
    {
    onanimate = true;
    $( "#Add-panel" ).css("left","2%");
    $( "#Add-panel" ).transition({ opacity: 1 });
    $( "#Add-panel" ).transition({ x: 100},function(){onanimate=false;});
    addpanelshow=!addpanelshow;
    }
    
};
function AddPanelHide()
{
    if(!onanimate)
    {
    onanimate = true;
    
    $( "#Add-panel" ).transition({ opacity: 0 });
    $( "#Add-panel" ).transition({ x: 0},function(){onanimate=false;$( "#Add-panel" ).css("left","-25%");});
    addpanelshow=!addpanelshow;
        
    }
};
function AddPanelToggle()
{
    if(!addpanelshow)
    AddPanelShow();
    else
    AddPanelHide();
};
function SettingPanelToggle()
{
    if(!settingshow)
        SettingPanelShow();
    else
       SettingPanelHide();
};
function SettingPanelShow()
{
    $( "#setting-panel" ).css("top","11%");
    $('#setting').transition({ rotate: '180deg' });
        $( "#setting-panel" ).transition({ opacity: 1 });
    settingshow=!settingshow;
};
function SettingPanelHide()
{
    $('#setting').transition({ rotate: '0deg' });
        $( "#setting-panel" ).transition({ opacity: 0 },function(){$( "#setting-panel" ).css("top","-80%");});
    settingshow=!settingshow;
};
function ControlPanelToggle()
{
    if(!controlpanelshow)
        ControlPanelShow();
    else
        ControlPanelHide();
};
function ControlPanelShow()
{
    $('#tool').transition({ rotate: '90deg' });
    controlpanelshow=!controlpanelshow;
};
function ControlPanelHide()
{
    $('#tool').transition({ rotate: '0deg' });
    controlpanelshow=!controlpanelshow;
};
function OrientationChanged()
{
    scwidth=$("#innercontent").width();
    controlpro=scwidth*0.07;
};
function ShadowCover()
{
    $("#shadow").transition({ x:scwidth});
};

function FullScreenPreview()
{    $("#innercontent").transition({ y:-$("#innercontent").height()*2});
     $("#header").transition({ y:-scheight},600,function(){
     $("#preview-panel").first().load("./test.html", function()          
    {
        $("#preview-panel").css("height","auto");
        $("#preview-panel").transition({ y:scheight},function(){$("#innercontent").transition({ opacity:0});});        
    });
    });
    
    
};
function EnvironmentInit()
{
    $("#addbtn")    .on("touchstart click",function(startEvent){AddPanelToggle();});
    $("#test")      .on("touchstart click",function(startEvent){ShadowCover();});
    $("#tool")      .on("touchstart click",function(startEvent){ControlPanelToggle();});
    $("#shadow")    .on("touchstart click",function(startEvent){ShadowFade();});
    $("#fullscreen").on("touchstart click",function(startEvent){FullScreenPreview();});
    $("#setting")   .on("touchstart click",function(startEvent){SettingPanelToggle();});
}
function ShadowFade()
{
    $("#shadow").transition({ x:0});
    $("#shadow").transition({ x:0});
};
window.addEventListener('orientationchange', OrientationChanged);
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}