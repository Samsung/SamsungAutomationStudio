function startRecording(webgl_renderer, render_func) {
    // create a clone of the webgl canvas
    var canvas = webgl_renderer.domElement.cloneNode();
    // init an 2D context
    var ctx = canvas.getContext('2d');
    function anim(){
        // render the webgl Animation
        render_func();
        // draw the wegbl canvas on our 2D one
        ctx.clearRect(0,0,canvas.width, canvas.height);
        ctx.drawImage(webgl_renderer.domElement, 0,0);
    }

    var fps = 60;
    // start our loop @60fps
    var stopAnim = audioTimerLoop(anim, 1000 / fps);
    // maximum stream rate set as 60 fps
    var cStream = canvas.captureStream(fps);

    let chunks = [];
    var recorder = new MediaRecorder(cStream);
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = e => {
        // we can stop our loop
        stopAnim();
        var url = URL.createObjectURL(new Blob(chunks));
        var v = document.createElement('video');
        v.src = url;
        v.controls = true;
        document.body.appendChild(v);
    }
    recorder.start();
    // stops the recorder in 20s, try to change tab during this time
    setTimeout(function() {
        recorder.stop();
    }, 20000);
    btn.parentNode.removeChild(btn);
}


/*
    An alternative timing loop, based on AudioContext's clock

    @arg callback : a callback function 
        with the audioContext's currentTime passed as unique argument
    @arg frequency : float in ms;
    @returns : a stop function

*/
function audioTimerLoop(callback, frequency) {

    var freq = frequency / 1000;      // AudioContext time parameters are in seconds
    var aCtx = new AudioContext();
    // Chrome needs our oscillator node to be attached to the destination
    // So we create a silent Gain Node
    var silence = aCtx.createGain();
    silence.gain.value = 0;
    silence.connect(aCtx.destination);

    onOSCend();

    var stopped = false;       // A flag to know when we'll stop the loop
    function onOSCend() {
        var osc = aCtx.createOscillator();
        osc.onended = onOSCend; // so we can loop
        osc.connect(silence);
        osc.start(0); // start it now
        osc.stop(aCtx.currentTime + freq); // stop it next frame
        callback(aCtx.currentTime); // one frame is done
        if (stopped) {  // user broke the loop
            osc.onended = function() {
                aCtx.close(); // clear the audioContext
                return;
            };
        }
    };
    // return a function to stop our loop
    return function() {
        stopped = true;
    };
}

/* global THREE */
/* Note that all rAF loop have been removed
since they're now handled by our 'audioTimerLoop' */


(function() {

    'use strict';
    var WIDTH = 500, HEIGHT = 500;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH , HEIGHT);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.CubeGeometry(5, 5, 5);
    var material = new THREE.MeshLambertMaterial({
        color: 0x00fff0
    });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 12;
    
    var pointLight = new THREE.PointLight(0xFFFFFF);

    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    scene.add(pointLight);

    var render = function() {        
        var delta = Math.random() * (0.06 - 0.02) + 0.02;

        cube.rotation.x += delta;
        cube.rotation.y += delta;
        cube.rotation.z -= delta;

        renderer.render(scene, camera);
    };
    render();
    console.clear();
    
    btn.onclick = function(){startRecording(renderer, render);};

}());