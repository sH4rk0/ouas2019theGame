---
name: Dancing Dots
type: fragment
author: http://glslsandbox.com/e#47201.0
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

void main( void ) {
    
    float sum = 0.0;
    float size = resolution.x / 12.0;
    float g = 0.93;
    int num = 100;
    for (int i = 0; i < 250; ++i) {
        vec2 position = resolution / 2.0;
        position.x += sin(time / 3.0 + 1.0 * float(i)) * resolution.x * 0.25;
        position.y += tan(time / 556.0 + (2.0 + sin(time) * 0.01) * float(i)) * resolution.y * 0.25;
        
        float dist = length(fragCoord.xy - position);
        
        sum += size / pow(dist, g);
    }
    
    vec4 color = vec4(0,0,0,1);
    float val = sum / float(num
               );
    color = vec4(0, val*0.5, val, 1);
    
    gl_FragColor = vec4(color);
}

---
name: Raster Sky
type: fragment
author: http://glslsandbox.com/e#47285.1
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

void main( void ) {

    vec2 realposition = ( fragCoord.xy / resolution.xy );
    vec2 position = realposition;

    position.x += time*0.05+120.;
    
    position.x *= cos(position.y*1.);
    
    vec2 star = vec2(0.8, 0.8);
    
    vec3 color = vec3(0.0);
    
    color.r = abs(sin(position.x*4.));
    color.g = abs(cos(position.x*4.+1.));
    color.b = abs(cos(position.x*4.));
        
    color.r *= cos(time*0.2+1.)*0.5+0.5;
    color.g *= sin(time*0.2)*0.5+0.5;
    color.b *= sin(time*0.2+5.)*0.5+0.5;
    

    vec3 skycolor= vec3(0.0);
        
    skycolor.r = sin(time*0.1+realposition.x     )*0.5+0.5;
    skycolor.g = cos(time*0.1+realposition.x + 2.)*0.5+0.5;
    skycolor.b = cos(time*0.1+realposition.x + 3.)*0.5+0.5;
    
    
    skycolor*= 0.3;
    
    skycolor += ((vec3(cos(time),cos(time),sin(time))*0.25+vec3(0.25) + vec3(0.50))*0.01)/distance(star, realposition);
    
    if(realposition.y>0.6)
        color *= 0.0;
    if(realposition.y>0.5)
        color = mix(skycolor ,color, (0.6-realposition.y)*10.);

    gl_FragColor = vec4( color, 1.0 );

}

---
name: Fractal Landscape
type: fragment
author: http://glslsandbox.com/e#54542.2
---

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

float rand(vec2 p) {
    return fract(sin(p.x*12.9898)+sin(p.y*78.233)*43758.545);
}

vec2 rand2(vec2 p) {
    return vec2(rand(p),rand(p*2.));
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    f = f * f * (3.0 - 2.0 * f);
    
    /*vec2 a = rand2(i);
    vec2 b = rand2(i+vec2(1.,0.));
    vec2 c = rand2(i+vec2(0.,1.));
    vec2 d = rand2(i+vec2(1.,1.));*/
    
    float a = rand(i);
    float b = rand(i+vec2(1.,0.));
    float c = rand(i+vec2(0.,1.));
    float d = rand(i+vec2(1.,1.));
    return mix(
        mix(a, b, f.x),
        mix(c, d, f.x),
        f.y);
}

float fractalNoise(vec2 p) {
    float color = 0.;
    for (float i = 0.; i  < 4.; i++) {
        color += noise(p*pow(2.,i)) / pow(2.,(i+1.)/1.5);
    }
    return color / 3.;
}

float map(vec3 p) {
    return p.y - fractalNoise(p.xz)*2.;
}

vec3 normal(vec3 p) {
    vec2 e = vec2(0.001,0.);
    return normalize(vec3(
        map(p+e.xyy)-map(p-e.xyy),
        map(p+e.yxy)-map(p-e.yxy),
        map(p+e.yyx)-map(p-e.yyx)));
}

void main( void ) {

    vec2 uv = ( 2.*fragCoord.xy- resolution.xy )/resolution.y;

    vec3 eye = vec3(0.,1.3,time);
    vec3 raydir = normalize(vec3(uv.x, uv.y-.5, 1.));
    vec3 p = eye;
    float hit = 0.;
    float depth = 0.0;
    float totald = 0.0;
    
    for (float i = 0.; i < 256.; i++) { 
        float d = map(p);
        depth += 0.5;
        totald += d * 0.5;
        if ((d) < 0.001 || totald > 16.0) {
            hit = i;
            break;
        }
        p += raydir * d * 0.5;
    
    }
    
    vec3 lightdir = -normalize(vec3(.5,-1.,-.5));
    vec3 color;
        color = (vec3(p - vec2(0.0, time).xxy).yyy);
    if (color.x < 0.5) color = vec3(0.1,0.1,0.7);
    else
    {
        color *= vec3(0.2,0.6,0.2);
    }
    gl_FragColor = vec4( color, 1.0 );

}

---
name: Raster Carpet
type: fragment
author: https://www.shadertoy.com/view/MlSSR3
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

void main( void ) {
   
    float y = (fragCoord.xy / resolution.x + 1.).y;
    float t = time * 3.0;
    float s = 0.0;  
    vec4 c = vec4(0.0);
    c.b += cos(y * 4. - 5.0);   
    
    for (float k = 0.; k < 18.; k += 1.) {        
        s = (sin(t + k / 3.4)) / 6. + 1.25;;        
        if (y > s && y < s + .05) {
            c = vec4(s, sin(y + t * .3), k / 16., 1.) * (y - s) * sin((y - s) * 20. * 3.14) * 38.;
        }
    }   
    
    gl_FragColor = c;
}

---
name: Vertical Marble
type: fragment
author: http://glslsandbox.com/e#54773.1
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

void main( void ) 
{
    vec2 pos = (fragCoord.xy / resolution.xy);
    
    float vv = pos.y*pos.y;
    vv*=sin(pos.x*3.14);
    
    float v = sin(sin(pos.x*15.0)*4.0+(vv) *50.0 + time * 2.0);
    v+=0.65;
    
    float stime = 0.3+sin(time*1.0)*0.5;
    gl_FragColor = vec4( v*1.3, 0.25+.3*v, 0.5, 1.0 ) * (1.0-stime*0.3);
}

---
name: Lava Marble
type: fragment
author: http://glslsandbox.com/e#54773.1
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

mat2 rot(float a)
{
  float s = sin(a);
  float c = cos(a);
  return mat2(c, s, -s, c);
}

vec3 pat1(vec2 pos)
{
    pos*=rot(length(pos)*0.5+pos.x*pos.y);
    float vv = pos.y*pos.y;
    vv*=sin(pos.x*1.04);
    float v = (sin(sin(pos.x*5.0)*4.0+(vv) *50.0 + time * 2.0))+0.25;
    v=abs(v);
    vec3 col = vec3( 1.5,0.8,0.6+sin(time)*0.5)*v ;
    return col;
}

void main( void ) 
{
    vec2 pos = (fragCoord.xy / resolution.xy);
    pos-=vec2(0.5);
    vec3 back = pat1(pos);
    back *= pat1(pos*rot(0.5));
    gl_FragColor = vec4( back,1.0);
}

---
name: Snow
type: fragment
author: hatsuyuki by Catzpaw 2016
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

float snow(vec2 uv,float scale)
{
    float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;
    uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;
    uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;
    p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);
    k=smoothstep(0.,k,sin(f.x+f.y)*0.01);
    return k*w;
}

void main(void){
    vec2 uv=(fragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y); 
    vec3 finalColor=vec3(0);
    float c=smoothstep(1.,0.3,clamp(uv.y*.3+.8,0.,.75));
    c+=snow(uv,8.);
    c+=snow(uv,6.);
    c+=snow(uv,5.);
    finalColor=(vec3(c));
    finalColor *= vec3(.7, 0.5, 1.);
    gl_FragColor = vec4(finalColor,1);
}

---
name: Vertical Spectrum
type: fragment
author: http://glslsandbox.com/e#54619.0
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

vec3 eye(float c){
    float r = exp2(-pow(c, 2.0)) * 0.9 + exp2(-pow((c + 3.0) * 2.0, 2.0)) * 0.3;
    float g = exp2(-pow((c + 1.0),2.0));
    float b = exp2(-pow((c + 2.145) * 1.1, 2.0));
    
    return vec3(r, g, b);
}

void main( void ) {

    vec2 position = fragCoord.xy / resolution.xy;

    vec3 color = vec3(0.0);
         color = eye(position.x * 10.0 - 6.0);

    gl_FragColor = vec4(color, 1.0 );
}

---
name: Sun Spiral
type: fragment
author: http://glslsandbox.com/e#54645.0
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 fragCoord;

vec3 hsv(float h, float s, float v)
{
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void main(void)
{
    vec2 p = (fragCoord.xy * 2.0 - resolution) / min(resolution.x,resolution.y);
    p*=1.1;
    vec2 q;
     
    vec2 l=vec2(1.,0.); 
    q.y = length(p);
    q.x = dot(p,l)/(length(p)*length(l));
    float u = sin((atan(p.y, p.x) + time * 0.5) * 20.0) * 0.1;
   
    vec3 line = vec3(0.0);
    vec3  color = hsv(0.1, 1.0, 1.);
    float thickness=0.008;
    line += thickness / abs(0.1+u-mod(q.y,.4)) * color;
    line += thickness / abs(0.2-mod(q.y,.2)) * color;
    line *= 1.-floor(q.y);
    line += thickness*10. / abs(sin((atan(p.y, p.x)+time*0.5 ) * 20.)+q.y  )* color;

    gl_FragColor = vec4(line, 1.0);
}

---
name: Hue Twister
type: fragment
author: http://glslsandbox.com/e#54654.0
---

precision mediump float;
uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

void main()
{
    vec2 r = resolution,
    o = fragCoord.xy - r/2.;
    o = vec2(length(o) / r.y - .35, atan(o.y,o.x));    
    vec4 s = .1*cos(1.5*vec4(0,1,2,3) + time + o.y + sin(o.y) * sin(time)*8.);
    vec4 e = s.yzwx;
    vec4 f = min(o.x-s,e-o.x);
    gl_FragColor = dot(clamp(f*r.y,0.,1.),80.*(s-e)) * (s-0.1) - f;
}

---
name: Particle Ball
type: fragment
author: http://glslsandbox.com/e#54678.3 and Richard Davey
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    
    float mx = clamp(mouse.x, 0.5, 1.0);
    float my = clamp(mouse.y, 0.5, 1.0);

    float t=time;
    float z=1.0;
    const int n=500;
    
    vec3 startColor=normalize(vec3(1.5,0.0,1.0));
    vec3 endColor=normalize(vec3(1.0,1.0,0.5));
    
    float startRadius=0.4;
    float endRadius=0.7;
    
    float power=0.3;
    float duration=0.6;
    
    vec2 s=resolution.xy, v=z*(2.0*gl_FragCoord.xy-s)/s.y;
    v*=my/s.y*10.0;
    duration=mx/s.x*10.0;
    
    vec3 col=vec3(0.0);
    
    float dMax=duration;
    float mb=0.0;
    float mbRadius=0.0;
    float sum=0.0;
    
    for(int i=0;i<n;i++){
        float d = fract(t*power+48934.4238*sin(float(i)*692.7398))*duration;
        float a = 6.28*float(i)/float(n);
        
        float x = d*cos(a);
        float y = d*sin(a);
        
        float distRatio = d/dMax;
        
        mbRadius = mix(startRadius, endRadius, distRatio);
        
        vec2 p = v - vec2(x,y);
        mb = mbRadius/dot(p,p);
        
        sum += mb;
        
        col = mix(col, mix(startColor, endColor, distRatio), mb/sum);
    }
    
    sum /= float(n);
    
    col = normalize(col) * sum;
    
    sum = clamp(sum, 0., .4);

    gl_FragColor=vec4(col*0.00002,1.0);

}

---
name: Sunset
type: fragment
author: https://www.shadertoy.com/view/4dcyW7
---

#ifdef GL_ES 
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 fragCoord;

void main( void )
{
    vec2 R = resolution.xy;
    vec2 uv = (fragCoord.xy - 0.5 * R) / R.y + 0.5;
    
    vec2 a = vec2(0.5,0.5);
    
    a.x = 0.5 + 
          0.01 *                        // wiggle
          sin(uv.y * 50.0 + time * 10.0);

    
    float dist = length(uv - a);
    
    float sunOutline = smoothstep(
        0.0, 
        -0.15, // blur
        max(dist - 0.5, -1.0));
   
    vec3 colour = sunOutline * mix(vec3(4.0, 0.0, 0.2), vec3(1.0, 1.1, 0.0), uv.y);  
   
    float glow = max(0.0, 1.0 - dist * 1.25);
    
    glow = min(glow * glow * glow, 0.325);
    
    colour += glow * vec3(1.5, 0.3, (sin(time)+ 1.0));  
   
    colour.rgb = min(colour.rgb, 1.0);
    
    gl_FragColor = vec4(colour, sunOutline);    
}

---
name: Colorful Voronoi
type: fragment
author: Brandon Fogerty (xdpixel.com)
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 fragCoord;

vec2 hash(vec2 p)
{
    mat2 m = mat2(  13.85, 47.77,
                    99.41, 8.48
                );

    return fract(sin(m*p) * 46738.29);
}

float voronoi(vec2 p)
{
    vec2 g = floor(p);
    vec2 f = fract(p);

    float distanceToClosestFeaturePoint = 1.0;
    for(int y = -1; y <= 1; y++)
    {
        for(int x = -1; x <= 1; x++)
        {
            vec2 latticePoint = vec2(x, y);
            float currentDistance = distance(latticePoint + hash(g+latticePoint), f);
            distanceToClosestFeaturePoint = min(distanceToClosestFeaturePoint, currentDistance);
        }
    }

    return distanceToClosestFeaturePoint;
}

void main( void )
{
    vec2 uv = ( fragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    float offset = voronoi(uv*10.0 + vec2(time));
    float t = 1.0/abs(((uv.x + sin(uv.y + time)) + offset) * 30.0);

    float r = voronoi( uv * 1.0 ) * 1.0;
    vec3 finalColor = vec3(10.0 * uv.y, 2.0, 1.0 * r ) * t;
    
    gl_FragColor = vec4(finalColor, 1.0 );
}

