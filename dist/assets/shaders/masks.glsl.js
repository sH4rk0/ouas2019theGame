---
name: Clouds
type: fragment
---

/*
    2D Cloud operation

    Made by: IVY

    you can check out how it looks on minecraft

    https://www.minecraftforum.net/forums/mapping-and-modding-java-edition/minecraft-mods/wip-mods/2953753-new-shader-pack-development
*/

precision mediump float;

uniform float time;
varying vec2 fragCoord;

float rand(float n) 
{ 
    return fract(sin(n)*43758.5453); 
}

float generateNoise(vec2 coord, float noiseResolution)
{
    coord /= noiseResolution;
    
    vec2 p = floor(coord);
    vec2 f = fract(coord);
    
    f = smoothstep(vec2(0.0), vec2(1.0), f);
    
    float n = p.x + p.y * noiseResolution;
    
    float p1 = mix(rand(n-1.0), rand(n), f.x);
    float p2 = mix(rand(n+(noiseResolution-1.0)), rand(n+noiseResolution), f.x);
    
    return mix(p1, p2, f.y);
}

void main( void ) 
{
    float cover = 0.8;
    float height = 1.5;
    
    // Noise resolution must be at least 64.0 or higher
    float noiseResolution = 64.0;
    
    float noise = 0.0;
    float frequency = 1.0;
    float amplify = 1.0;
    
    float speed = (time * noiseResolution) * 0.4;
    
    vec2 position = (fragCoord.xy * height) + speed;
    
    for (int i = 0; i < 8; i++) 
    {
        noise += generateNoise((position * frequency) - speed, noiseResolution) * amplify; 
        frequency *= 2.0;
        amplify *= 0.5;
    }     
    noise = noise - cover;
    
    gl_FragColor = vec4(noise);

    vec3 black = vec3(0.0, 0.0, 0.0);

    if (gl_FragColor.rgb == black)
    {
        gl_FragColor.a = 0.0;
    }
}

---
name: SquareWaveMask
type: fragment
---

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

void main( void ) {

    vec2 position = ( fragCoord.xy / resolution.xy);
    
    float x = position.x + sin(position.y * 7.0 + time * 2.0) * 25.5;
    float y = position.y + cos(position.x * 7.0 + time * 2.0) * 25.5;
    
    float colorX = floor(mod(((fragCoord.x + x / 2.2) / 50.0), 2.0));
    float colorY = floor((mod(((fragCoord.y + y / 2.2) / 50.0) + y * 0.0, 2.0) / 1.0 ) );
    
    float colorX1 = floor(mod(((fragCoord.x + 50.0 + x / 2.2) / 50.0), 2.0));
    float colorY2 = floor((mod((((fragCoord.y + y / 2.2) + 50.0) / 50.0) + y * 0.0, 2.0) / 1.0 ) );
    
    float squares1 = (colorX * colorY);
    float squares2 = (colorX1 * colorY2);
    
    float color = squares1 + squares2;  

    gl_FragColor = vec4(vec3(color, color, color), 1.0 );

    vec3 black = vec3(0.0, 0.0, 0.0);

    if (gl_FragColor.rgb == black)
    {
        gl_FragColor.a = 0.0;
    }

}

---
name: CircleMask
type: fragment
---

/*
 * Original shader from: https://www.shadertoy.com/view/3tf3D4
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define TAU 6.28318530718

const float grid = 6.;
#define pixel_width 3./iResolution.y*grid
#define t iTime/5.

float easeInOut(float time) {
    if ((time *= 2.0) < 1.0) {
        return 0.5 * time * time;
    } else {
        return -0.5 * ((time - 1.0) * (time - 3.0) - 1.0);
    }
}

float stroke(float d, float size, float width) {
    return smoothstep(pixel_width,0.0,abs(d-size)-width/2.);
}

float fill(float d, float size) {
    return smoothstep(pixel_width,0.0,d-size);
}

float circleSDF(vec2 uv) {
    return length(uv);
}

vec2 rotate(vec2 _uv, float _angle){
    _uv =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _uv;
    return _uv;
}

float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord.xy-iResolution.xy*.5)/iResolution.y;
    uv *= grid;
    uv.y += mod(grid,2.)* .5;
    vec2 id = floor(uv);
    vec2 gv = fract(uv)*2.-1.;
    
    float a = floor(random(id*floor(t))*8.)/8.;
    float next_a = floor(random(id*(floor(t)+1.))*8.)/8.;
    float angle = mix(a,next_a,easeInOut(fract(t)));
    gv = rotate(gv,angle*TAU);
    
    float col = fill(circleSDF(gv), .9);
    col = min(col,smoothstep(pixel_width,0.,gv.x-.6));
    col = min(col, step(uv.x,grid-1.));
    col = min(col, 1.-step(uv.x,-grid+1.));
    
    // Output to screen
    fragColor = vec4(vec3(col),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);

    vec3 black = vec3(0.0, 0.0, 0.0);

    if (gl_FragColor.rgb == black)
    {
        gl_FragColor.a = 0.0;
    }
}

---
name: SquareMask
type: fragment
---

/*
 * Original shader from: https://www.shadertoy.com/view/3tlGRr
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define SIZE 8.0 
#define HPI 1.5707963 
#define COL1 vec3(32, 43, 51) / 255.0 
#define COL2 vec3(235, 241, 245) / 255.0 
 
void mainImage(out vec4 fragColor, in vec2 fragCoord)
 { 
    vec2 uv = (fragCoord.xy - iResolution.xy * 0.5) / iResolution.x;
    float hsm = 1.5 / iResolution.y * SIZE * 0.5; // Half-Smooth factor
        
    uv *= SIZE; // Make grid
    vec2 id = floor(uv);
    uv = fract(uv) - 0.5;
    
    float angle = iTime; // Prepare rotation matrix    
    
    float phase = mod(floor(angle / HPI), 2.0); // Determine what phase is right now
    
    float mask = 0.0;
    for(float y =- 1.0; y <= 1.0; y++ ) { // Loop to draw neighbour cells
        for(float x =- 1.0; x <= 1.0; x++ ) {
            vec2 ruv = uv + vec2(x, y);
            vec2 rid = id + vec2(x, y);
                        
            // Golfed Rotation https://www.shadertoy.com/view/XlsyWX
            ruv *= mat2(cos( angle + vec4(0,33,11,0)));
            
            vec2 maskXY = smoothstep(0.5 + hsm, 0.5 - hsm, abs(ruv));            
            float maskI = maskXY.x*maskXY.y;  
            
            vec2 idm = mod(rid, 2.0);
            float draw = abs(idm.x*idm.y + (1.-idm.x)*(1.-idm.y) - phase); // Flip depending on phase            
            
            mask += maskI * draw;
        }
    }
    
    vec3 col = vec3(1.0);
    col = mix(COL1*.0, COL2, abs(mask - phase)); // Color flip depending on phase
    
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);

    vec3 black = vec3(0.0, 0.0, 0.0);

    if (gl_FragColor.rgb == black)
    {
        gl_FragColor.a = 0.0;
    }
}

---
name: WaveMask
type: fragment
---

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

varying vec2 fragCoord;

vec2 wave(vec2 f, float s) {
    for(float i = 1.; i < 2.; i++)
    {
        vec2 v = f;
        v.x += -0.75/i*sin(i*f.y+time/(50.0/s));
        v.y += 2.35/i*cos(i*f.x+time/(100.0/s));
        f=v;
    }
    return f;
}

mat2 rot(float g) {
    float s = sin(g);
    float c = cos(g);
    return mat2(c, s, -s, c);
}

void main(void) {
    float mx = max(resolution.x, resolution.y);
    vec2 uv = 4.0 * (2.0 * fragCoord.xy - resolution) / mx;
    uv *= rot(sin(time/3.)*0.01+0.4);
    uv = wave(uv, 196.);
    uv *= rot(cos(time/2.)*0.04+0.5);

    gl_FragColor = 1. - smoothstep(0.1, 0.2, vec4(sin(uv.x+uv.y*3.)));
    gl_FragColor.g = 0.;
    gl_FragColor.b /= 2.25;
}

---
name: Sine Mask
type: fragment
author: 
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926535897932384626433832795

void main()
{
    vec2 m = mouse.xy-0.5;
    vec2 o = gl_FragCoord.xy-resolution.xy/2.;
    
    vec2 edge = vec2(.4, cos(time+o.x*0.001)*0.25)*resolution;
    float smooth = smoothstep(-edge.x,edge.x,o.x);
          smooth *= 2.*edge.y;

    vec4 c = vec4(1,1,1,1);
         c *= step(smooth-edge.y, o.y);

    gl_FragColor = c;
}

---
name: Swirl Mask
type: fragment
author: 
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 fragCoord;

void main( void ) {
    vec2 c = resolution.xy / 2.;
    vec2 p = fragCoord.xy - resolution.xy * .5;
    float t = mod(time,10.0);
    t *= c.x < length(p) ? 0. : pow((c.x - length(p))/length(c),1.5) * 5.;
    gl_FragColor = vec4( p.y*cos(t) < p.x*sin(t) ? 1 : 0 ) ;
}
