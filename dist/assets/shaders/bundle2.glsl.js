---
name: Test Card
type: fragment
---

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 fragCoord;

#ifndef saturate
#define saturate(v) clamp(v,0.,1.)
//      clamp(v,0.,1.)
#endif
vec3 cyan=vec3(0.,0.5765,0.8275),
     magenta=vec3(0.8,0.,0.4196),
     yellow=vec3(1.,0.9451,0.0471);

void main(void){
    vec2 uv=fragCoord.xy/resolution;
    uv.x-=.5;
    uv.x*=resolution.x/resolution.y;
    uv.x+=.5;
    vec3 col=vec3(1.);
    col*=mix(cyan,vec3(1.),saturate((length(uv-vec2(.6,.4))-.2)/5e-3));
    col*=mix(magenta,vec3(1.),saturate((length(uv-vec2(.4,.4))-.2)/5e-3));
    col*=mix(yellow,vec3(1.),saturate((length(uv-vec2(.5,.6))-.2)/5e-3));
    if(floor(mod(fragCoord.y,2.))==0.){
    col=vec3(-2.);
    col+=mix(cyan,vec3(1.),saturate((length(uv-vec2(.6,.4))-.2)/5e-3));
    col+=mix(magenta,vec3(1.),saturate((length(uv-vec2(.4,.4))-.2)/5e-3));
    col+=mix(yellow,vec3(1.),saturate((length(uv-vec2(.5,.6))-.2)/5e-3));
    }
    gl_FragColor=vec4(col,1.);
}

---
name: Color Mix
type: fragment
author: http://glslsandbox.com/e#55504.0
---

precision mediump float;
uniform vec2 resolution;
uniform float time;

varying vec2 fragCoord;

void main()
{
    vec3 p = vec3((fragCoord.xy)/(resolution.y),sin(time * 0.2));
    for (int i = 0; i < 20; i++)
    {
        p.xzy = vec3(1.3,0.999,0.7)*(abs((abs(p)/dot(p,p)-vec3(1.0,1.0,cos(time * 0.2)*0.5))));
    }

    gl_FragColor.rgb = p;
    gl_FragColor.a = 1.0;
}   

---
name: Lava Planet
type: fragment
author: https://www.shadertoy.com/view/4dBBDD
---

#extension GL_EXT_shader_texture_lod : enable

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 fragCoord;

vec4 texture(sampler2D s, vec2 c) { return texture2D(s,c); }
vec4 textureLod(sampler2D s, vec2 c, float b) { return texture2DLodEXT(s,c,b); }

vec3 T(vec2 c, bool sky )
{
    vec4 t = texture(iChannel0,c*.1);
    
    if ( sky )
    {
        t = t * .75 + texture(iChannel0,c*.2 + time * .02) * .25;
        t = pow(t,vec4(.6));
    }
    
    return t.rgb;
}    

vec3 TraceRay( vec3 vRayOrigin, vec3 vRayDir )
{
    vec3 vRayOffest;
    vec3 g, t, l; 
    
    vec3 vWorldPos;
    
    vRayDir.z += vRayDir.y * .5;
    
    vRayOffest = vec3(0);
    vec3 vFog = vec3(0);
        
    vec3 pPrev = vRayOffest;
    
    bool sky = vRayDir.y > 0.;
    
    vec2 vTextureUV;
    
    for ( float h=0.; h<.6; h+=.001 )
    {        
        vRayOffest = vRayDir * h / vRayDir.y;
        vWorldPos = vRayOrigin + vRayOffest;
        if (sky )
        {
            vWorldPos.xz *= .2;
            vWorldPos.xz += time * 0.25;
        }
        
        vTextureUV = vWorldPos.xz;
        l = T( vTextureUV, sky );
        t = textureLod( iChannel1, vTextureUV, 15. * (l.x-vRayOffest.y) ).rgb;
        g = pow( l*t,
                    t+7. 
                    + sin(vRayOffest.x * 5. + time)
                    + sin(vRayOffest.z * 5. + time)                                                                           
                ) * h;
        
        vec3 pDelta = pPrev - vRayOffest;
        vFog.rgb+= g * exp(length(pDelta.xyz) * .4);
        
        if (vRayOffest.y >= l.x )
            break;        
    }
            
            
    l -= T( vTextureUV - .1, sky );

    
    if ( vRayDir.y > 0. )
        l += vec3(0.4, 0.3, 0.2);
    else 
        l += vec3(0.2, 0.3, 0.4);
    
    vec3 vResult = vec3(0);
    
    vResult = vFog +
         t * l 
        + g * 1e3
            * vRayOffest.y 
        ;
    
    if ( vRayDir.y > 0. )
        vResult = vResult.zyx;
    
    vResult *= exp( -dot(vRayOffest, vRayOffest)*.03);
        
    vResult = 1. - exp(-vResult * 1.5);     
    
    return vResult;
}

void mainImage( out vec4 fragColor, vec2 fragCoord )
{
    vec3 vRayOrigin, vRayDir;
    
    vRayDir = vec3( fragCoord / resolution.y, 1 );

    vRayDir.xy -= 0.5 * resolution.xy / resolution.y;
    vRayDir = normalize(vRayDir);
    
    vRayOrigin = vec3(.01, 0, -.2)*time;
 
    vec3 vResult = TraceRay( vRayOrigin, vRayDir );
    
    fragColor = vec4( vResult, 0 );
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}

---
name: Sugar3000
type: fragment
author: https://www.shadertoy.com/view/XdjBWV
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

#define PI 3.14159265358979323
#define RAYS 11.0
#define PROB 0.75
#define SIZE 0.45

float random (vec2 st) {
    return fract(sin(dot(st, vec2(12.5629849,78.1384))) * 41631.4232);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = fragCoord.xy / resolution.xy - vec2(0.5, 0.5);
    p.x *= resolution.x / resolution.y;
    float t = time - 10.0;
    
    float dist = length(p);
    float angle = atan(p.y, p.x) + PI;
  
    // create, subdivide vortex
    float angle_2 = angle * RAYS / PI + cos(dist * 15.0) * cos(t * 0.5) * (0.5 / (dist + 0.1));
    
    float cell_angle = mod(floor(angle_2), RAYS * 2.0);
    float cell_dist = pow(dist, 0.6) * 10.0 - (t + 0.5) * (mod(cell_angle, 2.0) - 0.5) * (0.4 + 0.6 * random(vec2(cell_angle + 0.1)));

    float s = abs(floor(cell_dist));
    float c = length(vec2(abs(fract(angle_2) - 0.5),
                          abs(fract(cell_dist)) - 0.5));
    // anti-aliasing
    float eps = 10.0 / (dist * PI * resolution.y);
    
    float mask = 1.0 - smoothstep(SIZE - eps, SIZE + eps, c);
    mask *= step(random(vec2(s, cell_angle)), PROB);
    
    // rainbow
    float col_ang = cell_angle * PI / RAYS;
    vec3 col = cos(vec3(col_ang) + vec3(0.0, 2.0/3.0, 4.0/3.0) * PI) * 0.5 + 0.5;

    // normal
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 n2 = rot * vec2(fract(angle_2) - 0.5, fract(cell_dist) - 0.5);
    vec3 norm = normalize(vec3(n2, cos(c / SIZE * 0.5 * PI)));
    
    // lights
    vec3 l1 = clamp(dot(normalize(vec3(-1.0, 0.0, 0.0)), norm), 0.0, 1.0) * vec3(0.6, 0.9, 0.95);
    vec3 l2 = pow(clamp(dot(normalize(vec3(0.0, -1.0, 1.0)), norm), 0.0, 1.0), 16.0) * vec3(0.95, 0.9, 0.6);
    
    fragColor = vec4(mix(vec3(1.0), col + 0.5 * l1 + l2, mask), 1.0);

    // gamma correction
    fragColor.xyz = pow(fragColor.rgb, vec3(1.0/2.2));
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}

---
name: Blobsesees
type: fragment
author: https://www.shadertoy.com/view/4sfXD4
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

#define E 60.0

void mainImage (out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    
    float t0 = sin(time);
    float t1 = sin(time / 2.0);
    float t2 = cos(time);
    float t3 = cos(time / 2.0);
    
    vec2 p0 = vec2(t1, t0);
    vec2 p1 = vec2(t2, t3);
    vec2 p2 = vec2(t0, t3);
    
    float a = 1.0 / distance(uv, p0);
    float b = 1.0 / distance(uv, p1);
    float c = 1.0 / distance(uv, p2);
    
    float d = 1.0 - pow(1.0 / (a+b+c), E) * pow(10.0, E * 0.7);
    
    fragColor = vec4(a * 0.5, b * 0.5, c * 0.5, 1.0) * d;
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}
