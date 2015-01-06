
function loadelemenylist()
{
    var body=document.getElementById('container');
    var name="container-1";
    var newelement=document.createElement('div');
    newelement.setAttribute('id','identifier');
    newelement.setAttribute('class','col-xs-6');
    body.appendChild(newelement);
   // var reader=new FileReader();
//    r.onload
    
}
jQuery(document).ready(function($){
    loadelemenylist();
})