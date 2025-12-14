
Canvas_Define(document.getElementById('myCanvas'))
// focallen(3000);
let xrange = parseFloat(document.getElementById('xid').value)
let yrange = parseFloat(document.getElementById('yid').value)
let zrange = parseFloat(document.getElementById('zid').value)
let ktx = parseFloat(document.getElementById('tx').value)
let kty = parseFloat(document.getElementById('ty').value)
let ktz = parseFloat(document.getElementById('tz').value)
let focalid = parseFloat(document.getElementById('fid').value)
setInterval(() => {
    xrange = parseFloat(document.getElementById('xid').value)
    yrange = parseFloat(document.getElementById('yid').value)
    zrange = parseFloat(document.getElementById('zid').value)
    ktx = parseFloat(document.getElementById('tx').value)
    kty = parseFloat(document.getElementById('ty').value)
    ktz = parseFloat(document.getElementById('tz').value)
    focalid = parseFloat(document.getElementById('fid').value)
    


    // focallen(focalid);
    Rotate(xrange, yrange, zrange, ktx, kty, ktz)
    main_renderer_function();
}, 1);
main_renderer_function();
main_renderer_function();
main_renderer_function();
main_renderer_function();
main_renderer_function();
main_renderer_function();
main_renderer_function();
main_renderer_function();
