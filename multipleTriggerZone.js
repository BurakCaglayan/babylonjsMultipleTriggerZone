var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.gravity = new BABYLON.Vector3(0, -9.8, 0);
    scene.collisionsEnabled = true

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    
    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.keysUp.push(87);
    camera.keysDown.push(83);
    camera.keysLeft.push(65);
    camera.keysRight.push(68);
    camera.speed=3;
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(1, 5, 1);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 6000, 6000, 2, scene);
    ground.checkCollisions = true;

    function create(xPosition, yPosition, zPosition, zoneCounter){
	// The first parameter can be used to specify which mesh to import. Here we import all meshes
	BABYLON.SceneLoader.ImportMesh("Shcroendiger'scat", "/scenes/", "SSAOcat.babylon", scene, function (newMeshes) {
		var cat = newMeshes[0];
        cat.position = new BABYLON.Vector3(xPosition, yPosition, zPosition);

        var box = BABYLON.MeshBuilder.CreateBox('box', {width: 10, height: 10, depth: 10}, scene);
        box.parent = cat;
        box.position.y = 10;
        var mat = new BABYLON.StandardMaterial("mat", scene);
        box.material = mat;


   // TriggerAreas
    var triggerAreas = [];
    // Easy to add a new area.
    triggerAreas.push({id: zoneCounter, name: 'areaOneTrigger', runOnHit: cLogHi, runOnLeave: cLogBye, isActive: true, runOnlyOnce: false, min: {x: xPosition - 75, y: 0, z: zPosition - 75}, max: {x: xPosition + 75, y: yPosition + 125, z: zPosition + 75}});

    function checkTriggers(camera){
        //get position before the loop, performance friendly.
        var pX = camera.position.x, pY = camera.position.y, pZ = camera.position.z;

        //Now start to check.
        for(var i = 0, max = triggerAreas.length; i < max; i++){
            var trig = triggerAreas[i]; //set trigger as a new variable, again, performance.
                    
                if(!trig || !trig.isActive) continue; //stop & continue to next trigger
                    
                var tMinX = trig.min.x, tMinY = trig.min.y, tMinZ = trig.min.z, tMaxX = trig.max.x, tMaxY = trig.max.y, tMaxZ = trig.max.z;

                if(pX > tMinX && pX < tMaxX && pY > tMinY && pY < tMaxY && pZ > tMinZ && pZ < tMaxZ){ //player entered trigger area.
                    if(trig.id != camera.lastTrigId){
                        camera.lastTrigId = trig.id;
                        if(trig.runOnlyOnce) trig.isActive = false;
                        if(trig.runOnHit != undefined) trig.runOnHit();
                    }
                } else if(trig.id === camera.lastTrigId){
                    camera.lastTrigId = 0; //player left trigger area.
                    if(trig.runOnLeave != undefined) trig.runOnLeave();
                } 
        }
    }
    var hl = new BABYLON.HighlightLayer("h1", scene);
    function cLogHi(){
        hl.addMesh(cat, BABYLON.Color3.Green());
        hl.addMesh(box,BABYLON.Color3.Blue());
        box.actionManager = new BABYLON.ActionManager(scene);
        box.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,
        function (event) {
            var pickedMesh=event.meshUnderPointer;
            alert("cat");
            }))
    }
    function cLogBye(){
        hl.removeMesh(cat);
        hl.removeMesh(box);
        box.actionManager = new BABYLON.ActionManager(scene);
        box.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.NothingTrigger,
            function (event) {
            }))
    }
    scene.registerBeforeRender(function(){
        checkTriggers(camera);
    })
	});
    }
    create(125,0,0,1);
    create(-125,0,0,2);

return scene;
};
