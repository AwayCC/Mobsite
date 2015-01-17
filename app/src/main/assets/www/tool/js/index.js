
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
var gallerypanelshow = false;
var githubpanelshow=false;
var isFullScreen=false;
var galleryMember;
var trapScroll;

var Android = (Android) ? Android : {
   startDrag: function(){},
   setSelectedHTML: function(s){},
   hideSplashView: function(){},
   getProjectName: function(){},
   getProjectPath: function(){}
};

jQuery(document).ready(function($){
    $('#picker').farbtastic('#color');
    console.log("helloworld!!!:D");
    var freeBounds = document.getElementById('propertypanel');
    
    scwidth=document.body.clientWidth;
    scheight=document.body.clientHeight;
    EnvironmentInit();

    // set title.
    document.getElementById("projecttitle").innerHTML = Android.getProjectName();
    console.log(Android.getProjectPath());
    // $("#innercontent").first().load("index.html");

    $("#innercontent").first().load("index.html", postLoadProject);

    //galleryMember=["abc","bcd"];
    //galleryMember=Android.getGalleryPaths();
    /*
    $("#innercontent").on("touchstart click",function(startEvent){
        showProperty(event.target);
    });
    */
    var tester=[{'path':'tree.jpg'}];
    
    Galleria.loadTheme('tool/gallery/galleria.classic.min.js');
    // Initialize Galleria
    
    //Galleria.ready(function(event){alert(abc);});
    galleryMember=JSON.stringify(tester);
    galleryInitialize(galleryMember);
    Galleria.run('#galleria');

});
function postLoadProject(){
    manager.init();
    setAddPanelDragLister();
    Android.hideSplashView();
}
function showProperty(tar)
{
    
    var computedStyle = getComputedStyle(tar, null);
   
    $("#propertyPanel").css("left","0");
    //if(rect.bottom<scheight/2)
    //{
   /*console.log("rect-top:"+rect.top);
    console.log("rect-bottom"+rect.bottom);
    console.log("rect-left"+rect.left);
    console.log("rect-right"+rect.right);
    console.log("screen-width"+scwidth);
    console.log("screen-height"+scheight);*/
   // alert("HH");
    
   // }
    var c=document.getElementById("properTable");
    c.style.display="none";
    document.getElementById("properCategory").innerHTML=tar.tagName;
    if(tar.tagName=="IMG")
    document.getElementById("properContent").innerHTML=tar.src.replace(/^.*[\\\/]/, '');
    if(tar.tagName=="P"||tar.tagName[0]=="H")
    document.getElementById("properContent").innerHTML=tar.innerHTML;
    document.getElementById("properHeight").innerHTML=computedStyle.height;
    document.getElementById("properWidth").innerHTML=computedStyle.width;
    document.getElementById("properColor").innerHTML=computedStyle.color;
    document.getElementById("properBackground").innerHTML=computedStyle.backgroundColor;
    document.getElementById("properOpacity").innerHTML=computedStyle.opacity;
    //document.getElementById("properPaddings").innerHTML=computedStyle.padding;
    document.getElementById("properSource").innerHTML=tar.src;
    if(c.hasAttribute("style"))
        c.removeAttribute("style");
    $("#propertyPanel").css("position","absolute");
    propertyPanelShow(tar);
}
function galleryImport(member)
{
    
}
function propertyPanelHide()
{
    if(!onanimate)
    {
        onanimate=true;
        $("#propertyPanel").transition({ opacity: 0 },function()
        {
        //    $("#propertyPanel").css("position","fixed");
            $("#propertyPanel").css("left","-100%");
            onanimate=false;
        });
        
    }
}
function propertyPanelShow( tar)
{
  //  alert("YY");
    if(!onanimate)
    {
       // alert("GG");
         var rect=tar.getBoundingClientRect();
    $("#propertyPanel").css("opacity","1");
    console.log("rect-top:"+rect.top);
    console.log("rect-bottom"+rect.bottom);
    console.log("rect-left"+rect.left);
    console.log("rect-right"+rect.right);
    console.log("screen-width"+scwidth);
    console.log("screen-height"+scheight);
    onanimate = true;
    var wid=$('#propertyPanel').width();
    var hei=$('#propertyPanel').height();
    if(rect.top<=0.5*scheight)
        $("#propertyPanel").css("top",window.scrollY+rect.bottom);
    else 
        $('#propertyPanel').css("top",window.scrollY+rect.top-hei);
    if(rect.left<=0.5*scwidth)
    {
        if(rect.right+wid<scwidth)
            $("#propertyPanel").css("left",rect.right);
        else
            $("#propertyPanel").css("right",0);
    }
    else
    {
        if(rect.left-wid>0)
            $('#propertyPanel').css("left",rect.left-wid);
        else 
            $('#propertyPanel').css("left",0);
    }
        

    /*$("#propertyPanel").transition({ opacity: 1 },function(){
        onanimate=false;*/
    //});
        onanimate=false;
    }
}
function galleryPanelShow()
{
    if(!onanimate)
    {
        onanimate = true;
        $( "#galleryPanel" ).css("top","10%");
        $( "#galleria").transition({opacity:1},function(){$( "#galleryPanel" ).transition({ opacity: 1 },function(){onanimate=false;});});
        
        gallerypanelshow=!gallerypanelshow;
    }
}
function galleryPanelHide()
{
    if(!onanimate) 
    {
        onanimate = true;
        $( "#galleryPanel" ).transition({ opacity: 0},function(){$( "#galleryPanel" ).css("top","-50%");onanimate=false;});      
        gallerypanelshow=!gallerypanelshow;
    }
}
function galleryPanelToggle()
{
    if(!gallerypanelshow)
        galleryPanelShow();
    else
        galleryPanelHide();
};
function galleryInitialize( member)
{
    var gallery=$(galleria);
   // console.log(member+"Here~");
    var memObj=JSON.parse(member);
    for (var i = 0; i < memObj.length; i++) 
    {
       // alert(memObj[i].path);
        gallery.append("<a href="+memObj[i].path+"><img src='"+memObj[i].path+"',data-big='"+memObj[i].path+"' data-title='Biandintz eta zaldiak' data-description='Horses on Bianditz mountain, in Navarre, Spain.'></a>");
    }
};
function test(){
    var rect = $("#header")[0].getBoundingClientRect();
    //alert(rect.width);
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
    console.log("Add toggle");
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
    if(!onanimate)
    {
    onanimate=true;
    $( "#setting-panel" ).css("top","11%");
    $('#setting').transition({ rotate: '180deg' });
        $( "#setting-panel" ).transition({ opacity: 1 },function(){onanimate=false;});
    settingshow=!settingshow;
    }    
};
function SettingPanelHide()
{
    if(!onanimate)
    {
    onanimate=true;
    $('#setting').transition({ rotate: '0deg' });
    $( "#setting-panel" ).transition({ opacity: 0 },function(){$( "#setting-panel" ).css("top","-80%");onanimate=false;});
    settingshow=!settingshow;
    }
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
{   
    isFullScreen=true;
     ShadowCover();
    $('#preview-panel').first().load('index.html');
    $('#preview-panel').css('top','0');  
    setTimeout("$('#preview-panel').transition({ opacity: 1 });",500);
    setTimeout("$('#innercontent').css('top','0'); ",800);
    setTimeout("$('#preview-control').transition({y:scheight/10});",500);
}
function FullScreenCancel()
{
    $("#innercontent").css("top","20%");
    $("#preview-control").transition({y:0});
    $("#preview-panel").transition({ opacity: 0 },function()
    {
        $("#preview-panel").css("top","-100%");
        $("#preview-panel").css("height","auto");
        $("#preview-panel").empty();   
        
    });
    ShadowFade();
    isFullScreen=false;
}
function deselect(){
    // Android function should be put inside manager.deselect();
    Android.deselect();
    manager.deselect();
}
function EnvironmentInit()
{
    $("#addbtn")    .on("touchstart click",function(startEvent){AddPanelToggle();});
    $("#editbtn")    .on("touchstart ",function(startEvent){ Android.openPhotoDialog();/*Android.openBrowserDialog();Android.openTextInputDialog();*/ });
    $("#dissbtn")    .on("touchstart ",function(startEvent){propertyPanelHide();});

    $("#test")      .on("touchstart click",function(startEvent){ShadowCover();});
    $("#tool")      .on("touchstart click",function(startEvent){ControlPanelToggle();});
    $("#shadow")    .on("touchstart click",function(startEvent){ShadowFade();});
    $("#fullscreen").on("touchstart ",function(startEvent){FullScreenPreview();});
    $("#setting")   .on("touchstart ",function(startEvent){SettingPanelToggle();});
    $("#github")    .on("touchstart ",function(startEvent){githubPanelShow();});
    $("#gallery")    .on("touchstart click ",function(startEvent){galleryPanelToggle();});
    $("#preview-control").on("touchstart click",function(startEvent){FullScreenCancel();});
    $("#properBackground").on("touchstart click",function(startEvent){colorSelector($("#properBackground"));});
    $("#properColor").on("touchstart click",function(startEvent){colorSelector($("#properColor"));});
    $("#propertyPanel").on("touchmove",function(startEvent){startEvent.preventDefault();});
}
function colorSelector(col)
{
    if(!onanimate)
    {
        onanimate=true;
        $("#previouscolor").css("background-color",col.innerHTML);
        $("#colorPickerPanel").transition({opacity: 1 });
    }
    
}
function githubPanelShow()
{
    if(!onanimate)
    {
    onanimate=true;
    githubpanelshow=true;
    ShadowCover();
    $("#githubPanel").css("opacity","0");
    $("#githubPanel").css("left","15%");
    setTimeout("$('#githubPanel').transition({opacity: 1 });onanimate=false;",500);
    }
}
function githubPanelHide()
{
    $('#githubPanel').transition({opacity: 0 });
    setTimeout("$('#githubPanel').css('left','-1000%');githubpanelshow=false;",500);
}
function ShadowFade()
{
    if(!onanimate)
    {
    if(githubpanelshow)
     githubPanelHide();
    setTimeout("$('#shadow').transition({ x:0});onanimate=false;",500);
    }
    
};
window.addEventListener('orientationchange', OrientationChanged);
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
};

// Event Listener of Add Panel
var addPanel_touchLongPress = false,
    addPanel_touchStill = false,
    addPanel_touchTarget,
    addPanel_touchX, addPanel_touchY;
function setAddPanelDragLister(){
    var panel = document.getElementById("Addmenu");
    panel.addEventListener('touchstart', onTouchStart, false);
    panel.addEventListener('touchmove', onTouchMove, false);
    panel.addEventListener('touchend', onTouchEnd, false);

    function onTouchStart(){
        if(addPanel_touchLongPress)
            return;
        if(event.touches.length > 1)
            return;

        // modify gesture flags.
        addPanel_touchStill = true;
        addPanel_touchTarget = event.target;
        setTimeout(longPressChecker, 600);

        // update new position.
        addPanel_touchX = event.touches.item(0).clientX;
        addPanel_touchY = event.touches.item(0).clientY;
    }
    function onTouchMove(){
        if(event.touches.length > 1)
            return;

        addPanel_touchStill = false;
        var touch = event.touches.item(0);
        //console.log("add panel move");
        if(addPanel_touchLongPress){
            event.preventDefault();
        }

        // update new position.
        addPanel_touchX = event.touches.item(0).clientX;
        addPanel_touchY = event.touches.item(0).clientY;
    }
    function onTouchEnd(){
        if(addPanel_touchLongPress){
            addPanel_touchLongPress = false;
            return;
        }
    }
    var longPressChecker = function(){
        if(addPanel_touchStill){
            addPanel_touchLongPress = true;
            console.log("Add panel : event "+addPanel_touchTarget.id);
            var index = 0;

            addPanel_touchTarget = addPanel_touchTarget.previousElementSibling;
            //console.log("Add panel : event "+addPanel_touchTarget.id);
            while(addPanel_touchTarget){
                index++;
                addPanel_touchTarget = addPanel_touchTarget.previousElementSibling;
            }

            console.log("Add panel : long press start at "+index+".");
            AddPanelToggle();

        }
    };
}

function createElement(index){
    var object;
    switch(index){
        case 0:
            // Title
            object = document.createElement("H1");
            object.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";
            return object;
            break;
        case 1:
            // text
            object = document.createElement("p");
            object.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
            return object;
            break;
        case 2:
            // container 1
            object = document.createElement("div");
            object.className = "row";
            col = document.createElement("div");
            col.className = "col-xs-12 col-sm-12 col-md-12 col-lg-12";
            object.appendChild(col);
            return object;
            break;
        case 3:
            // container 2
            object = document.createElement("div");
            object.className = "row";
            col = document.createElement("div");
            col.className = "col-xs-6 col-sm-6 col-md-6 col-lg-6";
            object.appendChild(col);
            return object;
            break;
        case 4:
            // container 3
            object = document.createElement("div");
            object.className = "row";
            col = document.createElement("div");
            col.className = "col-xs-4 col-sm-4 col-md-4 col-lg-4";
            object.appendChild(col);
            return object;
            break;
        case 5:
            // container 4
            object = document.createElement("div");
            object.className = "row";
            col = document.createElement("div");
            col.className = "col-xs-3 col-sm-3 col-md-3 col-lg-3";
            object.appendChild(col);
            return object;
            break;
        case 6:
            // container 6
            object = document.createElement("div");
            object.className = "row";
            col = document.createElement("div");
            col.className = "col-xs-2 col-sm-2 col-md-2 col-lg-2";
            object.appendChild(col);
            return object;
            break;
        case 7:
            // Picture
            object = document.createElement("img");
            object.src = "tool/img/default.png";
            return object;
            break;
    }
}

function setContent(){
    if(!manager.selectedObject){
        console.log("selected obj null");return;
        }
    switch(manager.selectedObject.tagName){
        case "IMG":
            Android.openPhotoDialog();
            break;

        case "P":
        case "H1":
        case "H2":
        case "H3":
        case "H4":
        case "H5":
        case "H6":
            Android.openTextInputDialog();
            break;

        default:
            Android.openBrowserDialog();
            break;
    }
}