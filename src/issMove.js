import * as THREE from "three";


const get_scale = (minus_position_y) =>{
    if (minus_position_y >= .96 ){
        return .45
    }
    
    if (minus_position_y >= .94 ){
        return .5
    }

    if (minus_position_y >= .92 ){
        return .55
    }

    if (minus_position_y >= .9 ){
        return .6
    }

    else if (minus_position_y >= .8 ){
        return .7
    }

    else if (minus_position_y >= .7 ){
        return .8
    }

    else if (minus_position_y >= .6 ){
        return .9
    }

    else if (minus_position_y >= .5 ){
        return 1
    }

    else if (minus_position_y >= .4 ){
        return 1.03
    }

    else if (minus_position_y >= .3 ){
        return 1.06
    }

    else if (minus_position_y >= .2 ){
        return 1.09
    }

    else{
        return 1.10
    }
}

const get_correction_lat = (param) =>{
    if (param >= 70){
        return 22
    }

    else if (param >= 60){
        return 30
    }

    else if (param >= 50){
        return 27
    }

    else if (param >= 40){
        return 26
    }

    else if (param >= 30){
        return 20
    }

    else if (param >= 20){
        return 17
    }

    else if (param >= 10){
        return 10
    }

    else {
        return 2
    }
}

const get_iss_ship = (equatorPoints, long = 131) =>{
    const issShipGeometry = new THREE.SphereGeometry(0.030, 16, 16);
    const issShipMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const issShip = new THREE.Mesh(issShipGeometry, issShipMaterial);

/*     const initialPosition = equatorPoints[Math.floor(equatorPoints.length / 4)]; 
 */    
    const initialPosition = {
        "x": 1,
        "y": 0,
        "z": 18.123233995736766e-17
    }
    console.log("INITIAL POSITION: ", initialPosition)
    issShip.position.copy(initialPosition);

    return issShip
}

const get_latitude_line = (latitude, longitude) =>{
    const equatorMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const minus_lat = latitude < 0 ? (latitude * -1) : latitude;
    let correct_lat = get_correction_lat(minus_lat);
    correct_lat = latitude < 0 ? (correct_lat * -1) : correct_lat;
    const position_y =  (latitude + correct_lat) / 100;
    const minus_position_y = position_y < 0 ? (position_y * -1) : position_y;

    let scale = get_scale(minus_position_y);
    console.log("LONGITUDE: ", longitude)
    console.log("LATITUDE: ", latitude)
    const equatorPoints = [];
    for (let i = 0; i <= 360; i++) {
        equatorPoints.push(new THREE.Vector3(Math.sin(i * Math.PI / 180), 0, Math.cos(i * Math.PI / 180)));
    }
    const equatorGeometry = new THREE.BufferGeometry().setFromPoints(equatorPoints);
    const equatorLine = new THREE.Line(equatorGeometry, equatorMaterial);

    // Apply position transformation to the equatorLine
    equatorLine.position.y = position_y;
    equatorLine.scale.set(scale, scale, scale);

    const issShip = get_iss_ship(equatorPoints)
    equatorLine.add(issShip)

    // Add rotation to make the circle spin around itself by 32 degrees
    longitude += 90
    const spinAngle = longitude * Math.PI / 180; // Convert degrees to radians
    equatorLine.rotation.y += spinAngle;

    return equatorLine;
};

export function create_iss(lat = 0, long = 0) {
    // Create the earthLines sphere
    let latitude = Math.round(lat);
    let longitude = Math.round(long);

    const earthLinesGeometry = new THREE.SphereGeometry(1.1, 32, 32);
    const earthLinesMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
    const earthLinesMesh = new THREE.Mesh(earthLinesGeometry, earthLinesMaterial);
    earthLinesMesh.rotation.y = 90 * Math.PI / 180;

    const latitude_line = get_latitude_line(latitude, longitude)

    earthLinesMesh.remove(latitude_line);
    earthLinesMesh.add(latitude_line);
    
    let iss_scale = 0
    earthLinesMesh.children.forEach((item)=>{
        iss_scale = item.scale.x
        if(item.scale.x > iss_scale){
            iss_scale = item.scale.x
        }
    })

    return earthLinesMesh;
}


