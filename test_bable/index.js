'use strict'

var name = function name() {
  console.log('test的fun name is name...')
}

var vertexDom = document.createElement('script')
vertexDom.setAttribute('type', 'x-shader/x-vertex')
vertexDom.setAttribute('id', '2d-vertex-shader')
vertexDom.innerHTML = ['attribute vec2 a_position;', 'attribute vec2 a_texCoord;', 'uniform vec2 u_resolution;', 'varying vec2 v_texCoord;', 'void main() {', 'vec2 zeroToOne = a_position / u_resolution;', 'vec2 zeroToTwo = zeroToOne * 2.0;', 'vec2 clipSpace = zeroToTwo - 1.0;', 'gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);', 'v_texCoord = a_texCoord;', '}'].join('\n')
document.head.appendChild(vertexDom)
console.log('cxs.....ly')
