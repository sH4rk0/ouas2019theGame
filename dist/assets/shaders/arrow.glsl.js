---
name: Eyeball
type: fragment
author: @acaudwell
---

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 fragCoord;

vec2 mouse2 = mouse*2.0-1.0;

#define RADIANS 0.017453292

float eye(vec3 p) {
    return length(p) - 1.0;
}

vec3 texture(vec3 n) {
    vec3 e = normalize(vec3(mouse2.x, mouse2.y, -1.0)) - n;
        float r = length(e);

    float iris = 0.33;
    float pupil = 0.11;
    
    if(r<iris) {
        r *=2.5;
        float d = smoothstep(-5.0, 5.0, min(sin(e.y*4.0/e.x*3.1431)-0.74, cos(e.x*3.1432/e.y*3.14321)-1.2))*2.0;
            
        if(r < pupil) return vec3(0.0);
    
        float s = r-pupil;
        
        vec3 c = mix(mix(vec3(0.0), mix(vec3(0.0, 0.28, 0.45)*5.0, vec3(0.0, 0.31, 0.55)*2.5 , abs(sin(d*0.4 + (s-pupil)/(iris-pupil)))*0.5+1.5),
                    abs(sin((r-pupil)/(iris-pupil)))), vec3(1.0), 1.0-smoothstep(0.0, 1.0, 1.0-(s-pupil)/s*0.25));
        return c;
    }

    return mix(vec3(0.3),vec3(1.0), smoothstep(0.0, 1.0, (r-iris)/0.02));
}

void main()
{
    vec2 uv = ((gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0);
    float t = time;
    float aspect = resolution.x / resolution.y;
    float fov    = tan( 70.0 * RADIANS * 0.5); 
    vec3 origin = vec3(0.0, 0.0, -2.0);
    vec3 dir = normalize( vec3( uv.x * aspect * fov, uv.y * fov, 1.0) );
    vec3 ray = origin;
    float d;
    for(int i=0;i<15;i++)
    {
        d = eye(ray);
    ray += dir * d;
    }
    vec3 n = normalize(sin(ray));
    vec3 e = normalize(vec3(mouse.x*2.0-1.0, mouse.y*2.0-1.0, -1.0)) - n;
    vec3 c = texture(normalize(n));
    float s = 1.0 - length(vec3(0.0, 0.0, -1.0) - n) * length(e);   
    vec4 ccc =vec4(vec3(c*s), 1.0);
    gl_FragColor = ccc;
    
}

---
name: Arrow
type: fragment
---

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 fragCoord;

const float PI = 3.14159265;
const float PI2 = PI * 2.0;
const float PI_2 = PI * 0.5;

float angle(vec2 v) {
    float a = acos(v.x/length(v));
    if (v.y < 0.0) a = PI2 - a;
    return a;
}

vec2 rotate(vec2 v, vec2 dir) {
    float av = angle(v);
    float ad = angle(dir) + PI_2;
    float a = av - ad;
    float len = length(v);
    v.x = len * cos(a);
    v.y = len * sin(a);
    return v;
}

bool inArrow(vec2 size, vec2 pos, float scale, vec2 dir) {
    //size /= scale;
    pos = rotate(pos, dir);
    bool isTail = pos.y > 0.0 && abs(pos.x) < size.x * 0.5 && abs(pos.y) < size.y;
    bool isHead = pos.y < 0.0 && size.x-abs(pos.x) > abs(pos.y);
    return isTail || isHead;
}

void main (void) {

    vec2 origin = vec2(0.0, 0.0);
   
    if (inArrow(vec2(150.0, 100.0), gl_FragCoord.xy - resolution.xy * 0.5, mouse.x, normalize(mouse*2.0- 1.0)))
    {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    } 

}
