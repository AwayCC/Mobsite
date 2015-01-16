
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
var githubpanelshow=false;
var isFullScreen=false;
var galleryMember;
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

    //$("#innercontent").first().load(Android.getProjectPath()+"/index.html");
    $("#innercontent").first().load("index.html");
    //galleryMember=["abc","bcd"];
    //galleryMember=Android.getGalleryPaths();
    $("#innercontent").on("touchstart click",function(startEvent){
    showProperty(event.target);
    });
    var tester=[{'path':'tree.jpg'}];
    Galleria.loadTheme('tool/gallery/galleria.classic.min.js');
    // Initialize Galleria
    
    //Galleria.ready(function(event){alert(abc);});
    galleryMember=JSON.stringify(tester);
    galleryInitialize(galleryMember);
    Galleria.run('#galleria');
    Android.hideSplashView();
    
});
function showProperty(tar)
{
    var computedStyle = getComputedStyle(event.target, null);
    document.getElementById("properCategory").innerHTML=tar.tagName;
    if(tar.tagName=="IMG")
    document.getElementById("properContent").innerHTML=tar.src.replace(/^.*[\\\/]/, '');
    if(tar.tagName=="P"||tar.tagName[0]=="H")
    document.getElementById("properContent").innerHTML=tar.innerHTML;
    document.getElementById("properHeight").innerHTML=computedStyle.height;
    document.getElementById("properWidth").innerHTML=computedStyle.width;
    document.getElementById("properColor").innerHTML=computedStyle.color;
    document.getElementById("properBackgound").innerHTML=computedStyle.backgroundColor;
    document.getElementById("properOpacity").innerHTML=computedStyle.opacity;
    document.getElementById("properPadding").innerHTML=computedStyle.padding;
    document.getElementById("properSource").innerHTML=tar.src;
}
function galleryImport(member)
{
    
}
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
    console.log("Add toggle");
    if(!addpanelshow)
    AddPanelShow();
    else
    AddPanelHide();
};
function SettingPanelToggle()
{
     galleryInitialize(galleryMember);
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
    $("#addbtn")    .on("touchstart ",function(startEvent){AddPanelToggle();});

    // added by ray.
    $("#editbtn")    .on("touchstart ",function(startEvent){ Android.openPhotoDialog();/*Android.openBrowserDialog();Android.openTextInputDialog();*/ });
    $("#dissbtn")    .on("touchstart ",function(startEvent){
        try{
            //deselect();

            Android.getProjectsPathJSON();

            /*
            var request = new XMLHttpRequest();
            request.open("GET", "img/img1.jpg", true);
            //request.open("GET", "../../"+Android.getProjectPath()+"/index.html", true);
            //request.open("GET", "./img/ic_action_add.png", true);
            //request.open("GET", "file:///android_asset/init/default/image/01.jpg", true);
            //request.open("GET", "http://www.google.fr/images/srpr/logo3w.png", true);
            //request.overrideMimeType("text/plain; charset=x-user-defined");

            request.responseType = 'arraybuffer';


            request.onload = function(e){
                console.log("**** Get file content :");
                //if (this.status == 200) {
                    var uInt8Array = new Uint8Array(this.response);
                    var i = uInt8Array.length;
                    var binaryString = new Array(i);
                    while (i--)
                    {
                      binaryString[i] = String.fromCharCode(uInt8Array[i]);
                    }
                    var data = binaryString.join('');

                    var base64 = window.btoa(data);
                    console.log(base64);
                    //document.getElementById("myImage").src="data:image/png;base64,"+base64;
                //}else{ console.log("e04, fail"+this.status); }
                //console.log(e.currentTarget.response);
                //console.log(base64ArrayBuffer(e.currentTarget.response));
            };
            request.send();
            */
        } catch(e) { console.log(e.message); }

    });

    $("#test")      .on("touchstart click",function(startEvent){ShadowCover();});
    $("#tool")      .on("touchstart click",function(startEvent){ControlPanelToggle();});
    $("#shadow")    .on("touchstart click",function(startEvent){ShadowFade();});
    $("#fullscreen").on("touchstart ",function(startEvent){FullScreenPreview();});
    $("#setting")   .on("touchstart ",function(startEvent){SettingPanelToggle();});
    $("#github")    .on("touchstart ",function(startEvent){githubPanelShow();});
    $("#preview-control").on("touchstart click",function(startEvent){FullScreenCancel();});
}
function githubPanelShow()
{
    githubpanelshow=true;
    ShadowCover();
    $("#githubPanel").css("opacity","0");
    $("#githubPanel").css("left","15%");
    setTimeout("$('#githubPanel').transition({opacity: 1 })",500);
}
function githubPanelHide()
{
    $('#githubPanel').transition({opacity: 0 });
    setTimeout("$('#githubPanel').css('left','-1000%');githubpanelshow=false;",500);
}
function ShadowFade()
{
    if(githubpanelshow)
     githubPanelHide();
    setTimeout("$('#shadow').transition({ x:0});",500);
    
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