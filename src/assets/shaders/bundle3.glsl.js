---
name: Protean Clouds
type: fragment
---

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

varying vec2 fragCoord;

#define iMouse mouse
#define iResolution resolution
#define iTime (time * 0.5)

// Protean clouds by nimitz (twitter: @stormoid)
// https://www.shadertoy.com/view/3l23Rh
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
// Contact the author for other licensing options

/*
    Technical details:

    The main volume noise is generated from a deformed periodic grid, which can produce
    a large range of noise-like patterns at very cheap evalutation cost. Allowing for multiple
    fetches of volume gradient computation for improved lighting.

    To further accelerate marching, since the volume is smooth, more than half the the density
    information isn't used to rendering or shading but only as an underlying volume distance to 
    determine dynamic step size, by carefully selecting an equation (polynomial for speed) to 
    step as a function of overall density (not necessarialy rendered) the visual results can be 
    the same as a naive implementation with ~40% increase in rendering performance.

    Since the dynamic marching step size is even less uniform due to steps not being rendered at all
    the fog is evaluated as the difference of the fog integral at each rendered step.

*/

mat2 rot(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}
const mat3 m3 = mat3(0.33338, 0.56034, -0.71817, -0.87887, 0.32651, -0.15323, 0.15162, 0.69596, 0.61339)*1.93;
float mag2(vec2 p){return dot(p,p);}
float linstep(in float mn, in float mx, in float x){ return clamp((x - mn)/(mx - mn), 0., 1.); }
float prm1 = 0.;
vec2 bsMo = vec2(0);

vec2 disp(float t){ return vec2(sin(t*0.22)*1., cos(t*0.175)*1.)*2.; }

vec2 map(vec3 p)
{
    vec3 p2 = p;
    p2.xy -= disp(p.z).xy;
    p.xy *= rot(sin(p.z+iTime)*(0.1 + prm1*0.05) + iTime*0.09);
    float cl = mag2(p2.xy);
    float d = 0.;
    p *= .61;
    float z = 1.;
    float trk = 1.;
    float dspAmp = 0.1 + prm1*0.2;
    for(int i = 0; i < 5; i++)
    {
        p += sin(p.zxy*0.75*trk + iTime*trk*.8)*dspAmp;
        d -= abs(dot(cos(p), sin(p.yzx))*z);
        z *= 0.57;
        trk *= 1.4;
        p = p*m3;
    }
    d = abs(d + prm1*3.)+ prm1*.3 - 2.5 + bsMo.y;
    return vec2(d + cl*.2 + 0.25, cl);
}

vec4 render( in vec3 ro, in vec3 rd, float time )
{
    vec4 rez = vec4(0);
    const float ldst = 8.;
    vec3 lpos = vec3(disp(time + ldst)*0.5, time + ldst);
    float t = 1.5;
    float fogT = 0.;
    for(int i=0; i<130; i++)
    {
        if(rez.a > 0.99)break;

        vec3 pos = ro + t*rd;
        vec2 mpv = map(pos);
        float den = clamp(mpv.x-0.3,0.,1.)*1.12;
        float dn = clamp((mpv.x + 2.),0.,3.);
        
        vec4 col = vec4(0);
        if (mpv.x > 0.6)
        {
        
            col = vec4(sin(vec3(5.,0.4,0.2) + mpv.y*0.1 +sin(pos.z*0.4)*0.5 + 1.8)*0.5 + 0.5,0.08);
            col *= den*den*den;
            col.rgb *= linstep(4.,-2.5, mpv.x)*2.3;
            float dif =  clamp((den - map(pos+.8).x)/9., 0.001, 1. );
            dif += clamp((den - map(pos+.35).x)/2.5, 0.001, 1. );
            col.xyz *= den*(vec3(0.005,.045,.075) + 1.5*vec3(0.033,0.07,0.03)*dif);
        }
        
        float fogC = exp(t*0.2 - 2.2);
        col.rgba += vec4(0.06,0.11,0.11, 0.1)*clamp(fogC-fogT, 0., 1.);
        fogT = fogC;
        rez = rez + col*(1. - rez.a);
        t += clamp(0.5 - dn*dn*.05, 0.09, 0.3);
    }
    return clamp(rez, 0.0, 1.0);
}

float getsat(vec3 c)
{
    float mi = min(min(c.x, c.y), c.z);
    float ma = max(max(c.x, c.y), c.z);
    return (ma - mi)/(ma+ 1e-7);
}

//from my "Will it blend" shader (https://www.shadertoy.com/view/lsdGzN)
vec3 iLerp(in vec3 a, in vec3 b, in float x)
{
    vec3 ic = mix(a, b, x) + vec3(1e-6,0.,0.);
    float sd = abs(getsat(ic) - mix(getsat(a), getsat(b), x));
    vec3 dir = normalize(vec3(2.*ic.x - ic.y - ic.z, 2.*ic.y - ic.x - ic.z, 2.*ic.z - ic.y - ic.x));
    float lgt = dot(vec3(1.0), ic);
    float ff = dot(dir, normalize(ic));
    ic += 1.5*dir*sd*ff*lgt;
    return clamp(ic,0.,1.);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{   
    vec2 q = fragCoord.xy/iResolution.xy;
    vec2 p = (gl_FragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
    bsMo = (iMouse.xy - 0.5*iResolution.xy)/iResolution.y;
    
    float time = iTime*3.;
    vec3 ro = vec3(0,0,time);
    
    ro += vec3(sin(iTime)*0.5,sin(iTime*1.)*0.,0);
        
    float dspAmp = .85;
    ro.xy += disp(ro.z)*dspAmp;
    float tgtDst = 3.5;
    
    vec3 target = normalize(ro - vec3(disp(time + tgtDst)*dspAmp, time + tgtDst));
    ro.x -= bsMo.x*2.;
    vec3 rightdir = normalize(cross(target, vec3(0,1,0)));
    vec3 updir = normalize(cross(rightdir, target));
    rightdir = normalize(cross(updir, target));
    vec3 rd=normalize((p.x*rightdir + p.y*updir)*1. - target);
    rd.xy *= rot(-disp(time + 3.5).x*0.2 + bsMo.x);
    prm1 = smoothstep(-0.4, 0.4,sin(iTime*0.3));
    vec4 scn = render(ro, rd, time);
        
    vec3 col = scn.rgb;
    col = iLerp(col.bgr, col.rgb, clamp(1.-prm1,0.05,1.));
    
    col = pow(col, vec3(.55,0.65,0.6))*vec3(1.,.97,.9);

    col *= pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.12)*0.7+0.3; //Vign
    
    fragColor = vec4( col, 1.0 );
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}

---
name: Ripple
type: fragment
---

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;

varying vec2 fragCoord;

vec4 texture(sampler2D s, vec2 c) { return texture2D(s,c); }

// Ref: http://adrianboeing.blogspot.in/2011/02/ripple-effect-in-webgl.html
void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
{
    // pixel position normalised to [-1, 1]
    vec2 cPos = -1.0 + 2.0 * fragCoord.xy / resolution.xy;

    // distance of current pixel from center
    float cLength = length(cPos);

    vec2 uv = fragCoord.xy/resolution.xy+(cPos/cLength)*cos(cLength*12.0-time*4.0) * 0.005;

    vec3 col = texture(iChannel0,uv).xyz;

    fragColor = vec4(col,1.0);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}

---
name: Rain Drops
type: fragment
---

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;
uniform vec2 mouse;

varying vec2 fragCoord;

vec4 texture(sampler2D s, vec2 c) { return texture2D(s,c); }

/*

A quick experiment with rain drop ripples.

This effect was written for and used in the launch scene of the
64kB intro "H - Immersion", by Ctrl-Alt-Test.

 > http://www.ctrl-alt-test.fr/productions/h-immersion/
 > https://www.youtube.com/watch?v=27PN1SsXbjM

-- 
Zavie / Ctrl-Alt-Test

*/

// Maximum number of cells a ripple can cross.
#define MAX_RADIUS 2

// Set to 1 to hash twice. Slower, but less patterns.
#define DOUBLE_HASH 0

// Hash functions shamefully stolen from:
// https://www.shadertoy.com/view/4djSRW
#define HASHSCALE1 .1031
#define HASHSCALE3 vec3(.1031, .1030, .0973)

float hash12(vec2 p)
{
    vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p)
{
    vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
    p3 += dot(p3, p3.yzx+19.19);
    return fract((p3.xx+p3.yz)*p3.zy);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // float Sresolution = 10. * exp2(-3.*iMouse.x/resolution.x);
    // float Sresolution = 10. * exp2(-3.*mouse.x/resolution.x);
    float Sresolution = 10. * exp2(-3.*100.0/resolution.x);
    vec2 uv = fragCoord.xy / resolution.y * Sresolution;
    vec2 p0 = floor(uv);

    vec2 circles = vec2(0.);
    for (int j = -MAX_RADIUS; j <= MAX_RADIUS; ++j)
    {
        for (int i = -MAX_RADIUS; i <= MAX_RADIUS; ++i)
        {
            vec2 pi = p0 + vec2(i, j);
            #if DOUBLE_HASH
            vec2 hsh = hash22(pi);
            #else
            vec2 hsh = pi;
            #endif
            vec2 p = pi + hash22(hsh);

            float t = fract(0.3*time + hash12(hsh));
            vec2 v = p - uv;
            float d = length(v) - (float(MAX_RADIUS) + 1.)*t;

            float h = 1e-3;
            float d1 = d - h;
            float d2 = d + h;
            float p1 = sin(31.*d1) * smoothstep(-0.6, -0.3, d1) * smoothstep(0., -0.3, d1);
            float p2 = sin(31.*d2) * smoothstep(-0.6, -0.3, d2) * smoothstep(0., -0.3, d2);
            circles += 0.5 * normalize(v) * ((p2 - p1) / (2. * h) * (1. - t) * (1. - t));
        }
    }
    circles /= float((MAX_RADIUS*2+1)*(MAX_RADIUS*2+1));

    float intensity = mix(0.01, 0.15, smoothstep(0.1, 0.6, abs(fract(0.05*time + 0.5)*2.-1.)));
    vec3 n = vec3(circles, sqrt(1. - dot(circles, circles)));
    vec3 color = texture(iChannel0, uv/resolution - intensity*n.xy).rgb + 5.*pow(clamp(dot(n, normalize(vec3(1., 0.7, 0.5))), 0., 1.), 6.);
    fragColor = vec4(color, 1.0);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}

---
name: Barrel Deformation
type: fragment
---

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;

varying vec2 fragCoord;

vec4 texture(sampler2D s, vec2 c) { return texture2D(s,c); }

//based on the barrel deformation shader taken from:
//http://www.geeks3d.com/20140213/glsl-shader-library-fish-eye-and-dome-and-barrel-distortion-post-processing-filters/2/

//CONTROL VARIABLES
float uPower = 0.3; // barrel power - (values between 0-1 work well)
float uSpeed = 4.0;
float uFrequency = 4.0;

vec2 Distort(vec2 p, float power, float speed, float freq)
{
    float theta  = atan(p.y, p.x);
    float radius = length(p);
    radius = pow(radius, power*sin(radius*freq-time*speed)+1.0);
    p.x = radius * cos(theta);
    p.y = radius * sin(theta);
    return 0.5 * (p + 1.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord )
{
  vec2 xy = 2.0 * fragCoord.xy/resolution.xy - 1.0;
  vec2 uvt;
  float d = length(xy);

  //distance of distortion
  if (d < 1.0 && uPower != 0.0)
  {
    //if power is 0, then don't call the distortion function since there's no reason to do it :)
    uvt = Distort(xy, uPower, uSpeed, uFrequency);
  }
  else
  {
    uvt = fragCoord.xy / resolution.xy;
  }
  vec4 c = texture(iChannel0, uvt);
  fragColor = c;
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}

---
name: Mouse Ripple
type: fragment
---

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D iChannel0;

varying vec2 fragCoord;

vec4 texture(sampler2D s, vec2 c) { return texture2D(s,c); }

const float PI = 3.14159265359;

#define time (time * 5.0)

const vec3 eps = vec3(0.01, 0.0, 0.0);

float genWave1(float len)
{
    float wave = sin(8.0 * PI * len + time);
    wave = (wave + 1.0) * 0.5; // <0 ; 1>
    wave -= 0.3;
    wave *= wave * wave;
    return wave;
}

float genWave2(float len)
{
    float wave = sin(7.0 * PI * len + time);
    float wavePow = 1.0 - pow(abs(wave*1.1), 0.8);
    wave = wavePow * wave; 
    return wave;
}

float scene(float len)
{
    // you can select type of waves
    return genWave1(len);
}

vec2 normal(float len) 
{
    float tg = (scene(len + eps.x) - scene(len)) / eps.x;
    return normalize(vec2(-tg, 1.0));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / resolution.xy;
    vec2 so = mouse.xy / resolution.xy;

    // vec2 mm = vec2(113.5, 600.0 - 500.0);
    // vec2 so = mm.xy / resolution.xy;

    vec2 pos2 = vec2(uv - so);    //wave origin
    vec2 pos2n = normalize(pos2);

    float len = length(pos2);
    float wave = scene(len); 

    vec2 uv2 = -pos2n * wave/(1.0 + 5.0 * len);

    fragColor = vec4(texture(iChannel0, uv + uv2));
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
}
