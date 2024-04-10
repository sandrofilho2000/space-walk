import * as THREE from "three";
// Make the earthLines sphere rotate

export function createEarthLines() {
    // Create the earthLines sphere
    const earthLinesGeometry = new THREE.SphereGeometry(1.1, 32, 32);
    const earthLinesMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
    const earthLinesMesh = new THREE.Mesh(earthLinesGeometry, earthLinesMaterial);
    earthLinesMesh.rotation.y = 90 * Math.PI / 180;
    // Add visible lines for equator and Greenwich meridian
    const equatorMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const equatorPoints = [];
    for (let i = 0; i <= 360; i++) {
    equatorPoints.push(new THREE.Vector3(Math.sin(i * Math.PI / 180), 0, Math.cos(i * Math.PI / 180)));
    }
    const equatorGeometry = new THREE.BufferGeometry().setFromPoints(equatorPoints);
    const equatorLine = new THREE.Line(equatorGeometry, equatorMaterial);
    earthLinesMesh.add(equatorLine);

    const meridianMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const meridianPoints = [];
    for (let i = -180; i <= 180; i++) {
    meridianPoints.push(new THREE.Vector3(0, Math.sin(i * Math.PI / 180), Math.cos(i * Math.PI / 180)));
    }
    const meridianGeometry = new THREE.BufferGeometry().setFromPoints(meridianPoints);
    const meridianLine = new THREE.Line(meridianGeometry, meridianMaterial);
    earthLinesMesh.add(meridianLine);

    return earthLinesMesh
}
