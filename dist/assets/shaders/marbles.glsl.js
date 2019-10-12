precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float spheres(vec3 p) {
    if (length(p) < 15.) {
        vec3 pmod = mod(p, 5.) - 2.5;
        pmod.y = p.y - 1.;
        return length(pmod) - 1.5;
    } else {
        return 1.;  
    }
}

vec3 rotate (vec3 dir, float angle) {
    dir =  vec3(dir.x * cos(angle) - dir.z * sin(angle),
        dir.y,
        dir.x * sin(angle) + dir.z * cos(angle));
    return dir;
}

float floorColor (vec3 p) {
    return ((fract(p.x) < .5 == fract(p.z) < .5) ? 1. : 0.) * .2 + .6;
}

float map(vec3 p, bool reflection) {
    return min(reflection?1.:spheres(p), p.y);  
}

vec3 reflectdir (vec3 dir, vec3 p) {
    vec2 e = vec2(0.001,0.);
    vec3 normal = normalize(vec3(
        spheres(p+e.xyy)-spheres(p-e.xyy),
        spheres(p+e.yxy)-spheres(p-e.yxy),
        spheres(p+e.yyx)-spheres(p-e.yyx)));
    return dir - 2.*dot(dir, normal) * normal;
}

void main( void ) {

    vec2 position = ( 2.* gl_FragCoord.xy - resolution.xy )/ min(resolution.x, resolution.y);

    vec3 eye = vec3(cos(time/4.),2.,sin(time/4.));
    vec3 raydir = rotate(normalize(vec3(position.x, position.y-.3, -0.8)), time * .1);
    vec3 p = eye;
    int hit = -1;
    bool reflection = false;
    vec3 diffp = vec3(-1.);
    bool reflectionHit = false;
    vec3 lightdir = normalize(vec3(.0,-1.,0.));
    float light = 1.;
    
    for (int i = 0; i < 100; i++) {
        float d = map(p, reflection);
        if (d < 0.001) {
            hit = i;
            if (spheres(p) < 0.001) {
                raydir = reflectdir(raydir, p);
                reflection = true;
            }
            if (p.y < 0.001) {
                light = clamp(spheres(p), 0., 1.) * .5 + .5;
                diffp = p;
                reflectionHit = true;
                break;
            }
        }
        p += d * raydir;
    }
    
    vec3 color = vec3(.0);
    vec3 bgcolor = color = mix(vec3(.4,.2,.3), vec3(.8,.7,.3), position.y);
    if (hit > -1 && (reflectionHit || !reflection)) {
        color = mix(vec3(.1,.2,.3), vec3(.3,.7,.8), floorColor(diffp) * light); 
    }
    color = mix(color, bgcolor, clamp(length(p - eye)/15., 0., 1.)) * (1. - float(hit)/300.);

    gl_FragColor = vec4(color, 1.0 );

}