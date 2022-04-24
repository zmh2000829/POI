var Raphael = require("./raphael")

function multiple(value, len) {
  if (len == 0) return [];
  var a = [value];
  while (a.length * 2 <= len) a = a.concat(a);
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
}

function get_expr_values(tissues){
    var arr = new Array();
    for (var tissue_name in tissues){
        arr = arr.concat(tissues[tissue_name]['exp_values'])
    }
    return arr
}

function get_tumor_types(tissues){
    var arr = new Array()
    for (var tissue_name in tissues){
        arr = arr.concat(tissues[tissue_name]['tumor_types'])
    }
    return arr
}

function get_organs(tissues){
    var arr = new Array()
    for (var tissue_name in tissues){
        var tumor_types = tissues[tissue_name]['tumor_types']
        var tissue_type = tissues[tissue_name]['tissue_type']
        arr = arr.concat(multiple(tissue_type, tumor_types.length))
    }
    return arr;
}

function get_data(bodymap, color, tissues){
    var organs = get_organs(tissues);
    var expr_values = get_expr_values(tissues);
    var max_expr_value = arr_max(expr_values);
    for(var i = 0, len = organs.length; i < len; i++){
        var organ = organs[i]
        if (!bodymap[organ]['FPKM']){
            bodymap[organ]['FPKM'] = new Array();
        }
        // 调整FPKM值与依据FPKM值调整透明程度
        bodymap[organ]['FPKM'].push(parseFloat(expr_values[i]).toFixed(2));
        // 此处opacity一定要在0-1之间才有效
        bodymap[organ]['path'].attr({
            "fill": color,
            "opacity": expr_values[i]/max_expr_value
        });
    }
}

function show_value(organ, bodymap, color, Rinstance, tissues){
    var st = bodymap[organ];
    var box=st['text'].getBBox();
    var rect=Rinstance.rect(box.x+140,box.y+90,box.width,box.height+20,20).attr({'fill':'#000','opacity':0.9,'stroke-width':0});
    var tooltipsString = makeToolTipsString(tissues[st['id']], st['FPKM'])
    var text=Rinstance.text(box.x+(box.width/2)+140,box.y+(box.height/2)+100,tooltipsString.join('\n')).attr({"font-family":"arial",fill:"#fff","font-size":50});
    rect.hide();
    text.hide();
    st['path'][0].onmouseenter=function(){
        this.style.cursor = "hand";
        rect.show();
        text.show();
        st['path'].animate({fill:st['path'].color},500);
    }
    st['path'][0].onmouseleave=function(){
        this.style.cursor = "pointer";
        rect.hide();
        text.hide();
        st['path'].animate({fill:color},500);
    };
    st['path'][0].onmouseup=function(e){
        if($('#tooltip').is(':animated')){
            $('#tooltip').stop().animate({opacity: '100'});
        }
        var x_axis = e.pageX;
        var y_axis = e.pageY;
        if(tissues.content){
            tooltip(x_axis, y_axis, tissues.content);
        }
    };
}

function tooltip(x_axis, y_axis, content){
    $('#tip-content').html(content);
    $('#tooltip').css('display', 'block');
    $('#tooltip').fadeOut(6000);
    $('#tooltip').hover(function(){
        if($(this).is(':animated')){
            $(this).stop().animate({opacity: '100'});
        }
    });
    $('#tooltip').mouseleave(function(){
        $('#tooltip').fadeOut();
    });
}

function makeToolTipsString(tissue, str){
    var tooltipsString = [tissue['tissue_type']];
    var tumor_types = tissue['tumor_types'];
    for(var i = 0, len = tumor_types.length; i < len; i++) {
        if(str.constructor === Array){
            tooltipsString.push(tumor_types[i].toString()+': '+str[i].toString());
        } else {
            tooltipsString.push(tumor_types[i].toString()+': '+str.toString());
        }
    }
    return tooltipsString
}
function arr_max(arr) {
    var max = arr[0];
    for (var i = 1; i < arr.length; i++){
        if (arr[i] > max){
            max = arr[i];
        }
    }
    return max;
}

function uniq_array(arr){
    arr.sort();    //先排序
    var res = [arr[0]];
    for(var i = 1; i < arr.length; i++){
        if(arr[i] !== res[res.length - 1]){
            res.push(arr[i]);
        }
    }
    return res;
}

function set_box(bodymap, tissues, Rinstance){
    var xx=0;
    var yy=0;
    for(var state in bodymap){
        bodymap[state]['path'].color=Raphael.getColor(0.99);
        bodymap[state]['path'].attr({opacity:0});
        xx=bodymap[state]['path'].getBBox().x+(bodymap[state]['path'].getBBox().width/2);
        yy=bodymap[state]['path'].getBBox().y+(bodymap[state]['path'].getBBox().height/2);
        // 设置box
        if (state in tissues){
            var tooltipString = makeToolTipsString(tissues[state], ':00000000')
            bodymap[state]['text']=Rinstance.text(xx,yy,tooltipString.join('\n')).attr({"font-family":"arial",fill:"#111","font-size":50}).hide();
        } else {
            continue
        }
    }
}

exports.set_box = set_box
exports.show_value = show_value
exports.get_data = get_data
exports.get_organs = get_organs
