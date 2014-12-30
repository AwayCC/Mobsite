
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
    $("#innercontent").first().load("./test.html", function()          
    {
        scwidth=document.body.clientWidth;
        scheight=document.body.clientHeight;
    });
    header=$("#header");
    footer=$("#footer");
    
    $("#innercontent").click(function(event) {
        alert(event.target.id);
    });
    $("#addbtn").click(function(event) {
       Addpaneltoggle();
    });
    $("#test").click(function(event) {
       Shadowcover();
    });
    $("#tool").click(function(event) {
       Controlpaneltoggle();
    });
    $("#shadow").click(function(event){
        Shadowfade();
    });
    $("#fullscreen").click(function(event){
        fullscreenpreview();
    });
    $("#setting").click(function(event) {
       Settingpaneltoggle();
    });
    $ ("#controlpanel").on("touchstart click",function(startEvent)
    {
        if(pos)
        {
        $( "#controlpanel" ).css("left","-100%");
        $( "#controlcontent" ).transition({ x: -controlpro });
        $( "#controlpanel" ).transition({ opacity: 0},300,'snap',function(){
            pos=false;
        });
        }
        
    });
    $ ("#controlpanel").on("touchstart click",function(startEvent)
    {
        /*if(!ter)
        {
        header.transition({y:-terheight});
        footer.transition({y:terheight});
        ter=true;
        }
        else
        {
            header.transition({y:0});
            footer.transition({y:0});
            ter=false;
        }*/
    });
    $ ("#innercontent").on("touchstart click",function(startEvent)
    {
        /*if(!ter)
        {
        header.transition({y:-terheight});
        footer.transition({y:terheight});
        ter=true;
        }
        else
        {
            header.transition({y:0});
            footer.transition({y:0});
            ter=false;
        }*/
    });
    /*interact('.draggable')
    .draggable({
        // allow dragging of multple elements at the same time
        max: Infinity,

        // call this function on every dragmove event
        onmove: function (event) {
            var target = event.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
            target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        },
        // call this function on every dragend event
        onend: function (event) {
            var textEl = event.target.querySelector('p');
            
            textEl && (textEl.textContent =
                'moved a distance of '
                + (Math.sqrt(event.dx * event.dx +
                             event.dy * event.dy)|0) + 'px');
        }
    })
    // enable inertial throwing
    .inertia(true)
    // keep the element within the area of it's parent
    .restrict({
        drag: "parent",
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    });

    // allow more than one interaction at a time
    interact.maxInteractions(Infinity);*/
    
});
function test(){
    var rect = $("#header")[0].getBoundingClientRect();
    alert(rect.width);
    return true;
};
function Addpanelshow()
{
    if(!onanimate)
    {
    onanimate = true;
    $( "#Add-panel" ).transition({ opacity: 1 });
    $( "#Add-panel" ).transition({ x: 100},function(){onanimate=false;});
    addpanelshow=!addpanelshow;
    }
    
};
function Addpanelhide()
{
    if(!onanimate)
    {
    onanimate = true;
    $( "#Add-panel" ).transition({ opacity: 0 });
    $( "#Add-panel" ).transition({ x: 0},function(){onanimate=false;});
    addpanelshow=!addpanelshow;
    }
};
function Addpaneltoggle()
{
    if(!addpanelshow)
    Addpanelshow();
    else
    Addpanelhide();
};
function Settingpaneltoggle()
{
    if(!settingshow)
        Settingpanelshow();
    else
       Settingpanelhide(); 
};
function Settingpanelshow()
{
    $('#setting').transition({ rotate: '180deg' });
        $( "#setting-panel" ).transition({ opacity: 1 });
    settingshow=!settingshow;
};
function Settingpanelhide()
{
    $('#setting').transition({ rotate: '0deg' });
        $( "#setting-panel" ).transition({ opacity: 0 });
    settingshow=!settingshow;
};
function Controlpaneltoggle()
{
    if(!controlpanelshow)
        Controlpanelshow();
    else
       Controlpanelhide();
};
function Controlpanelshow()
{
    $('#tool').transition({ rotate: '90deg' });
    controlpanelshow=!controlpanelshow;
};
function Controlpanelhide()
{
    $('#tool').transition({ rotate: '0deg' });
    controlpanelshow=!controlpanelshow;
};
function OrientationChanged()
{
    scwidth=$("#innercontent").width();
    controlpro=scwidth*0.07;
};
function Shadowcover()
{
    $("#shadow").transition({ x:scwidth});
};

function fullscreenpreview()
{    $("#innercontent").transition({ y:-$("#innercontent").height()*2});
     $("#header").transition({ y:-scheight},600,function(){
     $("#preview-panel").first().load("./test.html", function()          
    {
        $("#preview-panel").css("height","auto");
         
        $("#preview-panel").transition({ y:scheight},function()
        {
            
            
            $("#innercontent").transition({ opacity:0});
        
        });        
    });
    });
    
    
};
function Shadowfade()
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