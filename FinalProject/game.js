//If you're reading this Mr. Grande, I just wanted to say that you're a great teacher and I've loved your class since 6th grade.
//Thank you so much for the year, and I hope I see you again on Pecos or something.

//Anyways, here's my JS file, which has all the important stuff

//CONTROLS ARE WASD TO MOVE, ARROW KEYS TO ROTATE CAMERA, M TO CHANGE CAMERA MODES, AND E TO ATTACK

//I was orginially going to add a build mode with like turrets and stuff, but I underestimated how hard that would be, and the game is fine without it.

//Right before submitting this, I'm realizing I could have added sound effects, but ehhh, I've put in enough work.
//You can listen to the music of your choice while playing.

//One last thing, my record score is around 139,000. Good luck.

//Globals
let flag_health=100;
let airlines=false;
let slime_health=5
let slime_speed=0.25

//Sets the attack lines and cone thing to visible or not depending on airlines variable
AFRAME.registerComponent('visible_check',{
    init: function(){
    },

    tick: function(time,timedelta){
        if (airlines){
            this.el.setAttribute('material','opacity',1)
        } else{
            this.el.setAttribute('material','opacity',0)
        }
    }
})

//User can go between first and third person using M, sets ui and camera positions accordingly
AFRAME.registerComponent('camera-modes',{
    schema: {
        hui:{type:'selector'},
        sui:{type:'selector'}
        
    },
    
    init: function(){
        this.frames=0
        this.first=false
        this.third=true

        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyM'){
                if (this.first){
                    this.first=false
                    this.third=true
                } else {
                    this.first=true
                    this.third=false
                }
            }
        });

    },

    tick: function(time,timedelta){
        let pos=this.el.object3D.position
        let rot=this.el.object3D.rotation

        let hui_pos=this.data.hui.object3D.position
        let sui_pos=this.data.sui.object3D.position
        

        if (this.first){
            pos.x=0
            pos.y=1
            pos.z=2

            rot.x=-15   

            hui_pos.x=-5
            hui_pos.y=2.6
            hui_pos.z=-2

            sui_pos.x=-5.1
            sui_pos.y=2.1
            sui_pos.z=-2

        } else{
            pos.x=0
            pos.y=2.5
            pos.z=5.5

            rot.x=-23

            hui_pos.x=-8.7
            hui_pos.y=4.5
            hui_pos.z=-2

            sui_pos.x=-9
            sui_pos.y=4
            sui_pos.z=-2
        }

        this.el.setAttribute('position',pos)
        this.el.setAttribute('rotation',rot)
        }
    
})

//Main controller of the player
AFRAME.registerComponent('input-check', {
    schema: {
        floorHeight: {type: 'number'},
        sui: {type: 'selector'}
    },

    init: function () {
        //Variables
        this.jump=false
        this.forward=false
        this.left=false
        this.back=false
        this.right=false
        this.leftrot=false
        this.rightrot=false
        this.upvelocity=0;
        this.jump_power=0.1;
        this.acceleration=0.02;
        this.movespeed=0.13;
        this.attack=false
        this.money=0
        //Frames of attack
        this.fattack=0

        //Jump Listener
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.jump===false){
                this.jump=true;
                this.upvelocity=0.5;
            }
        });

        //Move Forward Listeners
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyW'){
                this.forward=true
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.code === 'KeyW'){
                this.forward=false
            }
        });

        //Move Left Listeners
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyA'){
                this.left=true
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.code === 'KeyA'){
                this.left=false
            }
        });

        //Move Back Listeners
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyS'){
                this.back=true
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.code === 'KeyS'){
                this.back=false
            }
        });

        //Move Right Listeners
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyD'){
                this.right=true
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.code === 'KeyD'){
                this.right=false
            }
        });

        //Rotate Left Listenrs
        window.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowLeft'){
                this.leftrot=true
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft'){
                this.leftrot=false
            }
        });

        //Rotate Right Listeners
        window.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowRight'){
                this.rightrot=true
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowRight'){
                this.rightrot=false
            }
        });

        //Attack Listener
        window.addEventListener('keydown',(e)=> {
            if (e.code === 'KeyE' && this.attack===false){
                this.attack=true
                this.fattack=0
            }
        });

        //And about here I realized I could have combined all those... whoops.
       
    },
    
    tick: function(time,timeDelta){

        let pos=this.el.getAttribute('position');
        let rot=this.el.getAttribute('rotation');


        if (this.jump){
            //Implements Quadratic Jump Behavior
            this.upvelocity-=this.acceleration;
            pos.y+=this.upvelocity;
            if (pos.y<this.data.floorHeight+0.5){
                this.jump=false
                pos.y=this.data.floorHeight+0.5
            }
        }
        if (this.forward){
            //Trig functions to move forward based on rotation
            let radians=radians_convert(rot.y)
            pos.z-=Math.cos(radians)*this.movespeed
            pos.x-=Math.sin(radians)*this.movespeed
        } 
        if (this.left){
            //See above, rotated to be left
            let radians=radians_convert(rot.y+90)
            pos.z-=Math.cos(radians)*this.movespeed
            pos.x-=Math.sin(radians)*this.movespeed
        }
        if (this.back){
            //See above
            let radians=radians_convert(rot.y+180)
            pos.z-=Math.cos(radians)*this.movespeed
            pos.x-=Math.sin(radians)*this.movespeed
        }
        if (this.right){
            //See above
            let radians=radians_convert(rot.y+270)
            pos.z-=Math.cos(radians)*this.movespeed
            pos.x-=Math.sin(radians)*this.movespeed
        }
        if (this.leftrot){
            //See below
            if (this.attack){
                rot.y+=6
            } else{
                rot.y+=4
            }
            
        }
        if (this.rightrot){
            //Rotate faster when attacking to make it easier to hit things
             if (this.attack){
                rot.y-=6
            } else{
                rot.y-=4
            }
        }
        if (this.attack){
            let radians=radians_convert(rot.y)
            let scene=document.querySelector('a-scene')

            //Make attack object things visible
            airlines=true

            //Move forward at increased speed
            pos.z-=Math.cos(radians)*0.42
            pos.x-=Math.sin(radians)*0.42

            //Update frames of attacking
            this.fattack+=1

            //Ends attack after 16 frames and resets the frame counter
            if (this.fattack>=16){
                this.attack=false
                this.fattack=0
                airlines=false
            }

            //Every 4 frames cause it was too laggy, check for 'close enough' colision. If true then reduce the health of the slime
            if (this.fattack%4===0){
                scene.querySelectorAll('.slime').forEach((slime) => {
                    let slime_pos=slime.object3D.position;
                    let thispos=this.el.object3D.position;
                    if  (thispos.distanceTo(slime_pos)<3){
                        slime.parentNode.removeChild(slime)
                    }
            });}
            

        }

        this.el.setAttribute('position',pos);
        this.el.setAttribute('rotation',rot);

        this.data.sui.setAttribute('value',`Score: ${Math.floor(time)}`)
        

    },
});

//Spawns different types of slimes at increasing faster times, with increasingly higher health
AFRAME.registerComponent('slime-spawn', {
    schema: {
        target: {type: 'string'},
        targetui: {type: 'string'}
    },

    init: function(){ 
        this.start_delay=38
        this.delay=38
        this.delay_subtraction=0
    },

    tick: function(){
        this.delay-=0.2
        
        if (this.delay<=0){

            //Logic for decreasing delay time, I made it kinda weird
            if (this.delay_subtraction>(this.start_delay-4)){
                this.delay_subtraction+=0.04
            } else {
                this.delay_subtraction+=0.43
            }
            this.start_delay=35
            this.start_delay-=this.delay_subtraction
            this.delay=0
            this.delay+=this.start_delay

            slime_speed+=0.002
            let random=Math.random()

            if (random<0.63){
                //Create slime every 1.5 sec with certain attributes
                slime_health+=0.065
                let slime = document.createElement("a-gltf-model");
                slime.setAttribute('gltf-model','Assets/simple_slime_creature/scene.gltf')

                slime.setAttribute('scale',{x:3.2,y:3.2,z:3.2})
                slime.setAttribute('position', {x:Math.floor(random_generate(60)),y:-0.1,z:Math.floor(random_generate(30))});
                
                let health=slime_health
                let speed=slime_speed
                slime.setAttribute('slime-move',`target: ${this.data.target}; ui: ${this.data.targetui}; speed: ${speed}; health: ${health}; ground: 1`);
                slime.setAttribute('class','slime')

                this.el.sceneEl.appendChild(slime);

            } else if (random>0.63 && random<0.83){
                //Sometimes creates a weaker, smaller slime with higher speed
                slime_health+=0.065
                let slime = document.createElement("a-gltf-model");

                slime.setAttribute('gltf-model','Assets/blue_slime/scene.gltf')
                slime.setAttribute('scale',{x:2.7,y:2.7,z:2.7})
                    
                slime.setAttribute('position', {x:Math.floor(random_generate(60)),y:0,z:Math.floor(random_generate(30))});


                let health=slime_health-2.1
                let speed=slime_speed+0.13

                slime.setAttribute('slime-move',`target: ${this.data.target}; ui: ${this.data.targetui}; speed: ${speed}; health: ${health}; ground: 1`);
                slime.setAttribute('class','slime')

                this.el.sceneEl.appendChild(slime);

            } else{
                //Sometimes create a flying slime on a hoverboard to make the player jump
                slime_health+=0.065
                let slime = document.createElement("a-gltf-model");

                slime.setAttribute('gltf-model','Assets/fire_slime/scene.gltf')
                slime.setAttribute('scale',{x:1.3,y:1.3,z:1.3})
                    
                slime.setAttribute('position', {x:Math.floor(random_generate(60)),y:5,z:Math.floor(random_generate(30))});


                let health=slime_health+2
                let speed=slime_speed-0.165

                slime.setAttribute('slime-move',`target: ${this.data.target}; ui: ${this.data.targetui}; speed: ${speed}; health: ${health}; ground: 0`);
                slime.setAttribute('class','slime')

                //Hoverboard

                let board = document.createElement('a-gltf-model')
                board.setAttribute('gltf-model','Assets/hoverboard 1/scene.gltf')
                board.setAttribute('scale',{x:15, y:10, z:10})
                board.setAttribute('position',{x:0, y: 0.6, z:0})

                slime.appendChild(board)

                this.el.sceneEl.appendChild(slime);
            }
            }
            
        
    }
});

//Controlls slime movement
AFRAME.registerComponent('slime-move',{
    schema: {
        target: {type: 'selector'},
        ui: {type: 'selector'},
        speed: {type: 'number'},
        health: {type: 'number'},
        ground: {type: 'number'}
    },

    init: function(){
        this.speed=this.data.speed
        this.health=this.data.health
        this.dist;
        this.highpoint = new THREE.Vector3(0, 5, 0)
    },

    tick: function(){
        let flag_pos=this.data.target.object3D.position;
    
        let slime_pos=this.el.object3D.position;

        let dx=slime_pos.x-flag_pos.x;
        let dz=slime_pos.z-flag_pos.z;

        //If its flying, then use the higher point as the position vector, or distanceTo wont work for collision with the flag
        if (this.data.ground===1){
            this.dist = slime_pos.distanceTo(flag_pos);
        } else {
            this.dist = slime_pos.distanceTo(this.highpoint)
        }
        
    

        //Math to rotate towards flag (could not get lookAt to work)
        let desired_rotation=degrees_convert(Math.atan2(dx,dz));

        //Added 180 because the gltf models are like backwards by default for some reason
        this.el.setAttribute('rotation',{x:0,y:desired_rotation+180,z:0});

        //Move towards flag
        slime_pos.z-=Math.cos(Math.atan2(dx,dz))*this.speed;
        slime_pos.x-=Math.sin(Math.atan2(dx,dz))*this.speed;

        if (this.dist<2){
            //Flag takes damage of the slime health, then updates the ui thing, if the flag is at 0 than reload the game
            flag_health-=this.health
            flag_health=Math.floor(flag_health)

            //Update flag health ui
            this.data.ui.setAttribute('value',`Flag Health: ${flag_health}`)

            //Kill slime
            this.el.parentNode.removeChild(this.el)

            //Reload Game if flag is dead
            if (flag_health<=0){
                location.reload()
            }
        }
    }

})

//Helper Functions
function radians_convert(degrees){
    return degrees * (Math.PI/180)
}

function degrees_convert(radians){
    return radians * (180 / Math.PI);
}

function random_generate(range){
    num=Math.random()
    if (num<0.5){
        return (Math.random()*range)+5
    } else{
        return (Math.random()*(-1*range))-5
    }
}
