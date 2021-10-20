export const tdist = {
    210184:['沈北新区1','210200'],
    210185:['沈北新区2','210201'],
    210186:['沈北新区3','210202'],
    210187:['沈北新区4','210203'],
    210188:['沈北新区5','210204'],
    210189:['沈北新区6','210205'],
    110000:['省1','11'],
    220000:['省2','22'],
    330000:['省3','133'],
    223400:['市1','138'],
    115600:['市2','1216'],
    115678:['县1','177841'],
    223487:['县2','11224']
}

tdist.getLev1 = function () {
    for(var t = [],e = 1;e < 100;e++){
        var i ='0000';
        i = e < 10 ? '0' + e + i : e + i;  // typeof i string   010000 ~ 990000
        // 通过[]的形式来读取对象中的属性
        var n = this[i];  // this是tdist这个对象
        "undefined" != typeof n && t.push({
            id:i,
            text:n[0]
        })
    }
    return t
}

tdist.getLev2 = function (t) {
    if("" == t)
        return [];
    for(var e = [],i=1;i < 100;i++){
        var n = t.substr(0,2)
        n += i < 10 ? "0" + i + "00": i + "00"
        var r = this[n]
        "undefined" != typeof r && e.push({
            id:n,
            text:r[0]
        })
    }
    return e
}

tdist.getLev3 = function (t) {
    if("" == t)
        return []
    for(var e = [],i=1;i < 100;i++){
        var n = t.substr(0,4)
        n += i < 10 ? "0" + i : i
        var r = this[n]
        "undefined" != typeof r && e.push({
            id:n,
            text:r[0]
        })
    }
    return e
}