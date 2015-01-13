
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
jQuery(document).ready(function($){
    var freeBounds = document.getElementById('propertypanel');
    
    scwidth=document.body.clientWidth;
    scheight=document.body.clientHeight;
    EnvironmentInit();

    // set title.
    document.getElementById("projecttitle").innerHTML = Android.getProjectName();
    console.log(Android.getProjectPath());
    $("#innercontent").first().load(Android.getProjectPath()+"/index.html");
    //$("#innercontent").first().load("./www/index.html");
    Android.hideSplashView();
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
    $('#preview-panel').first().load('./www/index.html');
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

            Android.saveProject();

            var request = new XMLHttpRequest();
            request.open("GET", "file:///"+Android.getProjectPath()+"/img/img1.png", true);
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

function base64ArrayBuffer(arrayBuffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }

  return base64
}