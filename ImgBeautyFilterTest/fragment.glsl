    precision highp float;
    
    // our texture
    uniform sampler2D u_image;
    uniform vec2 u_textureSize;
    
    uniform float u_kernel[9];
    uniform float u_kernelWeight;
    
    uniform float u_params; 
    
    
    // the texCoords passed in from the vertex shader.
    varying vec2 v_texCoord;
    
    const vec3 W = vec3(0.299,0.587,0.114);
    const mat3 saturateMatrix = mat3(
    1.1102,-0.0598,-0.061,
    -0.0774,1.0826,-0.1186,
    -0.0228,-0.0228,1.1772);
    
    float hardlight(float color)
    {
    if(color <= 0.5)
    {
    color = color * color * 2.0;
    }
    else
    {
    color = 1.0 - ((1.0 - color)*(1.0 - color) * 2.0);
    }
    return color;
    }

    void main(){
    vec3 centralColor = texture2D(u_image, v_texCoord).rgb;
    if(u_params <= 0.0)
    {
        gl_FragColor = vec4(centralColor, 1.0);
    }
    else
    {
        vec4 param = vec4(100.0, 100.0, 0.0, 0.0);
        param.x = 50.0 / (2.0 * u_params * 100.0);
        param.y = 100.0 / (2.0 * u_params * 100.0);
        param.z = u_params * 10.0 * 0.05;
        param.w = u_params * 10.0 * 0.04;
        vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
        float sampleColor = texture2D(u_image, v_texCoord).g * 22.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(0,-10)).g * 1.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(0,10)).g * 1.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(-10,0)).g * 1.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(10,0)).g * 1.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(5,-8)).g * 1.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(5,8)).g * 1.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(-5,8)).g * 1.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(-5,-8)).g * 1.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(8,-5)).g * 1.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(8,5)).g * 1.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(-8,5)).g * 1.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(-8,-5)).g * 1.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(0,-6)).g * 2.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(0,6)).g * 2.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(6,0)).g * 2.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(-6,0)).g * 2.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(-4,-4)).g * 2.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(-4,4)).g * 2.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(4,-4)).g * 2.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(4,4)).g * 2.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(-2,-2)).g * 3.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(-2,2)).g * 3.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(2,-2)).g * 3.0 +
        texture2D(u_image, v_texCoord + onePixel * vec2(2,2)).g * 3.0;
        
        sampleColor = sampleColor / 62.0;
        
        
        float highpass = centralColor.g - sampleColor + 0.5;
        for(int i = 0; i < 5 ; i++){
            highpass = hardlight(highpass);
        }
        float lumance = dot(centralColor, W);
        float alpha = pow(lumance, param.x);
        vec3 smoothColor = centralColor + (centralColor-vec3(highpass))*alpha*0.1;
        smoothColor.r = clamp(pow(smoothColor.r, param.y),0.0,1.0);
        smoothColor.g = clamp(pow(smoothColor.g, param.y),0.0,1.0);
        smoothColor.b = clamp(pow(smoothColor.b, param.y),0.0,1.0);
        vec3 lvse = vec3(1.0)-(vec3(1.0)-smoothColor)*(vec3(1.0)-centralColor);
        vec3 bianliang = max(smoothColor, centralColor);
        vec3 rouguang = 2.0*centralColor*smoothColor + centralColor*centralColor - 2.0*centralColor*centralColor*smoothColor;
        vec4 tmpcolor = vec4(mix(centralColor, lvse, alpha), 1.0);
        tmpcolor.rgb = mix(tmpcolor.rgb, bianliang, alpha);
        tmpcolor.rgb = mix(tmpcolor.rgb, rouguang, param.z);
        vec3 satcolor = tmpcolor.rgb * saturateMatrix; 
        gl_FragColor = vec4(mix(tmpcolor.rgb, satcolor, param.w), 1.0);
    }         
}