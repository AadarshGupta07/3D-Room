uniform float uTime;
uniform vec3 startColor;
uniform vec3 stopColor;
uniform float gradientStop;
varying vec2 vUv;

void main() {
  float pulse = smoothstep(-1.0, 1.0, sin(uTime * 8.0));
  vec3 neonColor = mix(startColor, stopColor, smoothstep(0.0, gradientStop, pulse));
  gl_FragColor = vec4(neonColor, 1.0);
}
