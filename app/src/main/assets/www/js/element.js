
function loadelemenylist()
{
    var Ele_Name=["Title","Text","Container","Picture","HyperLink","Icon","InputBox","NavBar","Footer"];
    var body=document.getElementById('container');
    for (i = 0; i < Ele_Name.length; i++)
    {
    var name="container-1";
    var newelement=document.createElement('div');
    newelement.setAttribute('id','identifier');
    newelement.setAttribute('class','col-xs-6');
    body.appendChild(newelement);
    }
   
}
jQuery(document).ready(function($){
    loadelemenylist();
})