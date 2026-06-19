
AFRAME.registerComponent('change-color', {
    init: function () {
        this.el.addEventListener('click', (evt) => {
            this.el.setAttribute('material','color','red', {
            });
        });
    }
});

AFRAME.registerComponent('spin-box', {
    init: function () {
        this.el.addEventListener('click', (evt) => {
            this.el.setAttribute('animation', {
                property: 'rotation',
                to: '0 360 0',
                dur: 1800,
                loop: true,
                easing: 'linear'
            });
        });
    }
});

AFRAME.registerComponent('move-back', {
    init: function () {
        this.el.addEventListener('click', (evt) => {
            this.el.setAttribute('animation', {
                property: 'position',
                to: '2 0 -7',
                dur: 1500,
                dir: 'alternate',
                loop: true,
                easing: 'easeInOutSine'
            });
        });
    }
});

AFRAME.registerComponent('change-texture', {
    init: function () {
        this.el.addEventListener('click', (evt) => {
            this.el.setAttribute('material', 'src','textures/sun.jpg',{
            });
        });
    }
});