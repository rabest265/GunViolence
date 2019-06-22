
var tdiv, ttop, cen, hcount=-1;
var data=undefined;
var slist=[{name:"shot0"},{name:"shot1"},{name:"shot2"}];

$( document ).ready(function() {
   init();
});

getdata();

function setData(response){
    data = response;
    //console.log(data.length);
}

function getdata(){
    var newurl = "/jsonifiedguns/all";
    d3.json(newurl, function(response2) {
        //console.log('in d3 '+response2.length);
        setData(response2);
    });
}

function init(){
    ion.sound({
        sounds: slist,
        path: "/static/sound/",
        preload: true,
        multiplay: true,
        volume: "1.0"
    });
    tdiv=$('#home');
    sizeme();
    tdiv.on("mousedown touchstart", function(e){
        e.preventDefault();
        var myin=Math.floor(Math.random()*3);
        ion.sound.play(slist[myin].name);
        e = e.originalEvent || e;
        var startX = e.clientX || e.pageX;
		var startY = e.clientY || e.pageY;
        var bx=startX-40;
        var by=startY-40;
        hcount++;
        var deg=45-Math.random()*90;
        var bdiv=$("<div class='hole' id='h"+hcount+"' style='left:"+bx+"px; top:"+by+"px; -webkit-transform:rotate("+deg+"deg); transform:rotate("+deg+"deg);'></div>");
        tdiv.append(bdiv);
        if (data!==undefined){
            var rec=data[Math.floor(Math.random()*data.length)];
            var mstr=rec.incident_characteristics || "";
            mstr=mstr.split("||").join("</br>");
            var dt = rec.strdate;
            var str=dt+" - "+rec["city_or_county"]+", "+rec["state"]+"<br>"+mstr;
            var tdeg=5-Math.random()*10;
            $('#homemsg').css({"-webkit-transform":"rotate("+tdeg+"deg)", "transform":"rotate("+tdeg+"deg"});
            $('#homemsg').html(str).removeClass('toff');
        }
        setTimeout(function(){
            clearout(bdiv);
        },3000);
    });
       
}

function sizeme(){
    var tpos = tdiv.position();
    ttop=tpos.top;
    var fpos = $('#sticky-footer').position();
    var ht=fpos.top-tpos.top;
    var w = window.innerWidth;
    //tdiv.css({'height':ht+'px'});
    cen={"x":w/2, "y":ht/2};
    $('.hole').remove();
}

function clearout(el){
    el.addClass('gone');
    setTimeout(function(){
        el.remove();
    },1000);
}