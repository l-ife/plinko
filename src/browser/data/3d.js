import get from 'lodash/get';
// TODO: Make lines from birthdate to deathdate

var format = d3.format("+.3f");

function sq(x) {
    var s = Math.pow(x, 2);
    return s;
}

function v(x, y, z) {
    return new THREE.Vector3(x, y, z);
}

function createTextCanvas(text, color, font, size) {
    size = size || 16;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var fontStr = (size + 'px ') + (font || 'Arial');
    ctx.font = fontStr;
    var w = ctx.measureText(text).width;
    var h = Math.ceil(size);
    canvas.width = w;
    canvas.height = h;
    ctx.font = fontStr;
    ctx.fillStyle = color || 'black';
    ctx.fillText(text, 0, Math.ceil(size * 0.8));
    return canvas;
}

function createText2D(text, color, font, size, segW, segH) {
    var canvas = createTextCanvas(text, color, font, size);
    var plane = new THREE.PlaneGeometry(canvas.width, canvas.height, segW, segH);
    var tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;
    var planeMat = new THREE.MeshBasicMaterial({
        map: tex,
        color: 0xffffff,
        transparent: true
    });
    var mesh = new THREE.Mesh(plane, planeMat);
    mesh.scale.set(0.5, 0.5, 0.5);
    mesh.doubleSided = true;
    return mesh;
}

function scatter(points, extents, [w, h], keyPaths) {

    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(w, h);
    const domNode = d3.select('body').append('div')[0][0];
    domNode.appendChild(renderer.domElement);

    renderer.setClearColorHex(0xEEEEEE, 1.0);

    var camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000);
    camera.position.z = 300;
    camera.position.x = 0;
    camera.position.y = 100;

    var scene = new THREE.Scene();

    var scatterPlot = new THREE.Object3D();
    scene.add(scatterPlot);

    scatterPlot.rotation.y = 0;

    const xyzExtents = {
        x: extents[keyPaths.x],
        y: extents[keyPaths.y],
        z: extents[keyPaths.z]
    };

    var vs = {
        x: {
            max: xyzExtents.x[1],
            cen: (xyzExtents.x[1] + xyzExtents.x[0]) / 2,
            min: xyzExtents.x[0]
        },
        y: {
            max: xyzExtents.y[1],
            cen: (xyzExtents.y[1] + xyzExtents.y[0]) / 2,
            min: xyzExtents.y[0]
        },
        z: {
            max: xyzExtents.z[1],
            cen: (xyzExtents.z[1] + xyzExtents.z[0]) / 2,
            min: xyzExtents.z[0]
        }
    };

    var colour = d3.scale.category20c();

    var xScale = d3.scale.linear()
        .domain(xyzExtents.x)
        .range([-150, 150]);
    var yScale = d3.scale.linear()
        .domain(xyzExtents.y)
        .range([-50, 50]);
    var zScale = d3.scale.linear()
        .domain(xyzExtents.z)
        .range([-50, 50]);

    const sv = (xType, yType, zType) => v(xScale(vs.x[xType]), yScale(vs.y[yType]), zScale(vs.z[zType]));

    var lineGeo = new THREE.Geometry();

    const types = ['min', 'cen', 'max'];
    types.forEach(zType => {
        types.forEach(yType => {
            lineGeo.vertices.push(sv('min', yType, zType), sv('max', yType, zType));
        });
    });
    types.forEach(yType => {
        types.forEach(xType => {
            lineGeo.vertices.push(sv(xType, yType, 'min'), sv(xType, yType, 'max'));
        });
    });
    types.forEach(zType => {
        types.forEach(xType => {
            lineGeo.vertices.push(sv(xType, 'min', zType), sv(xType, 'max', zType));
        });
    });

    var lineMat = new THREE.LineBasicMaterial({
        color: 0x000000,
        lineWidth: 1
    });

    var line = new THREE.Line(lineGeo, lineMat);

    line.type = THREE.Lines;
    scatterPlot.add(line);

    var titleX = createText2D(`-${keyPaths.x}`);
    titleX.position.x = xScale(vs.x.min) - 12,
    titleX.position.y = 5;
    scatterPlot.add(titleX);

    var valueX = createText2D(format(xyzExtents.x[0]));
    valueX.position.x = xScale(vs.x.min) - 12,
    valueX.position.y = -5;
    scatterPlot.add(valueX);

    var titleX = createText2D(keyPaths.x);
    titleX.position.x = xScale(vs.x.max) + 12;
    titleX.position.y = 5;
    scatterPlot.add(titleX);

    var valueX = createText2D(format(xyzExtents.x[1]));
    valueX.position.x = xScale(vs.x.max) + 12,
    valueX.position.y = -5;
    scatterPlot.add(valueX);

    var titleY = createText2D(`-${keyPaths.y}`);
    titleY.position.y = yScale(vs.y.min) - 5;
    scatterPlot.add(titleY);

    var valueY = createText2D(format(xyzExtents.y[0]));
    valueY.position.y = yScale(vs.y.min) - 15,
    scatterPlot.add(valueY);

    var titleY = createText2D(keyPaths.y);
    titleY.position.y = yScale(vs.y.max) + 15;
    scatterPlot.add(titleY);

    var valueY = createText2D(format(xyzExtents.y[1]));
    valueY.position.y = yScale(vs.y.max) + 5,
    scatterPlot.add(valueY);

    var titleZ = createText2D(`-${keyPaths.z} ${format(xyzExtents.z[0])}`);
    titleZ.position.z = zScale(vs.z.min) + 2;
    scatterPlot.add(titleZ);

    var titleZ = createText2D(`${keyPaths.z} ${format(xyzExtents.z[1])}`);
    titleZ.position.z = zScale(vs.z.max) + 2;
    scatterPlot.add(titleZ);

    var mat = new THREE.ParticleBasicMaterial({
        vertexColors: true,
        size: 0.5
    });

    let pointGeo = new THREE.Geometry();
    for (var k = 0; k < points.length; k++) {
        // const p = points[k];
        // pointGeo.vertices.push(new THREE.Vector3(
        //     xScale(+p[keyPaths.x]), yScale(+p[keyPaths.y]), zScale(+p[keyPaths.z])
        // ));
        // pointGeo.colors.push(new THREE.Color(d3.hsl((+p.hue/255)*360, 1, 0.5, 1).toString()));
        pointGeo.vertices.push(new THREE.Vector3());
        pointGeo.colors.push(new THREE.Color());
    }
    let particleSystem = new THREE.ParticleSystem(pointGeo, mat);

    scatterPlot.add(particleSystem);

    renderer.render(scene, camera);

    function animate() {
        renderer.clear();
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
        window.requestAnimationFrame(animate, renderer.domElement);
    };
    animate();

    let i = 0;
    function doABatch() {
        for (var j = 0; j < 150000 && i < points.length; j++ && i++) {
            const p = points[i];
            particleSystem.geometry.vertices[i] = new THREE.Vector3(
                xScale(+get(p, keyPaths.x)), yScale(+get(p, keyPaths.y)), zScale(+get(p, keyPaths.z))
            );
            particleSystem.geometry.colors[i] = new THREE.Color(d3.hsl((+p.hue/255)*360, 1, 0.5, 1).toString());
        }
        if (i < points.length) {
            setTimeout(doABatch, 0);
        }
        particleSystem.geometry.verticesNeedUpdate = true;
        particleSystem.geometry.colorsNeedUpdate = true;
    }
    doABatch();

    let down = false;
    let sx = 0;
    let sy = 0;

    domNode.onmousedown = function(ev) {
        down = true;
        sx = ev.clientX;
        sy = ev.clientY;
    };
    domNode.onmouseup = function() {
        down = false;
    };
    domNode.onmousemove = function(ev) {
        if (down) {
            var dx = ev.clientX - sx;
            var dy = ev.clientY - sy;
            var dist = Math.sqrt(sq(camera.position.x) + sq(camera.position.y) + sq(camera.position.z));

            scatterPlot.rotation.y += dx * 0.01;
            scatterPlot.rotation.x += dy * 0.01;

            sx += dx;
            sy += dy;
        }
    }
}

const makeADomain = (data, keyPath) => d3.extent(data, d => +get(d, keyPath));

d3.csv("../data/878452Wc4n1uEFvZ.csv", function(data) {
    console.log('data loaded');

    const extents = {
        birthdate: makeADomain(data, 'birthdate'),
        age: makeADomain(data, 'age'),
        position: makeADomain(data, 'position'),
        ballRadius: makeADomain(data, 'ballRadius'),
        'mutationRate:ballRadius': makeADomain(data, 'mutationRate:ballRadius'),
        generation: makeADomain(data, 'generation'),
        hue: makeADomain(data, 'hue'),
        restitution: makeADomain(data, 'restitution')
    };

    scatter(data, extents, [1250, 700], {
        x: 'age',
        y: 'ballRadius',
        z: 'position'
    });
    scatter(data, extents, [1250, 700], {
        x: 'age',
        y: 'mutationRate:position',
        z: 'position'
    });
    scatter(data, extents, [1250, 700], {
        x: 'age',
        y: 'mutationRate:ballRadius',
        z: 'ballRadius'
    });
    scatter(data, extents, [1250, 700], {
        x: 'age',
        y: 'mutationRate:restitution',
        z: 'restitution'
    });
    scatter(data, extents, [1250, 700], {
        x: 'age',
        y: 'ballRadius',
        z: 'restitution'
    });

    scatter(data, extents, [1250, 700], {
        x: 'birthdate',
        y: 'ballRadius',
        z: 'position'
    });
    scatter(data, extents, [1250, 700], {
        x: 'birthdate',
        y: 'age',
        z: 'position'
    });
    scatter(data, extents, [1250, 700], {
        x: 'birthdate',
        y: 'age',
        z: 'ballRadius'
    });
    scatter(data, extents, [1250, 700], {
        x: 'birthdate',
        y: 'mutationRate:ballRadius',
        z: 'ballRadius'
    });
    scatter(data, extents, [1250, 700], {
        x: 'birthdate',
        y: 'mutationRate:ballRadius',
        z: 'restitution'
    });
    scatter(data, extents, [1250, 700], {
        x: 'birthdate',
        y: 'mutationRate:ballRadius',
        z: 'position'
    });
    scatter(data, extents, [1250, 700], {
        x: 'birthdate',
        y: 'age',
        z: 'mutationRate:ballRadius'
    });
});
