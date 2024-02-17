// Unity built-in shader source. Copyright (c) 2016 Unity Technologies. MIT license (see license.txt)

#ifndef ZEPETO_STANDARD_INPUT_INCLUDED
#define ZEPETO_STANDARD_INPUT_INCLUDED

#include "UnityCG.cginc"
#include "UnityStandardConfig.cginc"
#include "UnityPBSLighting.cginc" // TBD: remove
#include "UnityStandardUtils.cginc"

//---------------------------------------
// Directional lightmaps & Parallax require tangent space too
#if (_NORMALMAP || DIRLIGHTMAP_COMBINED || _PARALLAXMAP)
    #define _TANGENT_TO_WORLD 1
#endif

//---------------------------------------
half4       _Color;
half        _Cutoff;

sampler2D   _MainTex;
float4      _MainTex_ST;

sampler2D   _BumpMap;
half        _BumpScale;

sampler2D   _DetailNormalMap;
float4      _DetailNormalMap_ST;
half        _DetailNormalMapScale;

half        _Shininess;
sampler2D   _SpecGlossMap;
sampler2D   _MetallicGlossMap;
half        _Metallic;
float       _Glossiness;
float       _GlossMapScale;
float       _GlossMapBias;

sampler2D   _OcclusionMap;
half        _OcclusionStrength;

half        _UVSec;

half4       _EmissionColor;
sampler2D   _EmissionMap;

//-------------------------------------------------------------------------------------
// Input functions

struct VertexInput
{
    float4 vertex   : POSITION;
    half3 normal    : NORMAL;
    float2 uv0      : TEXCOORD0;
    float2 uv1      : TEXCOORD1;
#if defined(DYNAMICLIGHTMAP_ON) || defined(UNITY_PASS_META)
    float2 uv2      : TEXCOORD2;
#endif
#ifdef _TANGENT_TO_WORLD
    half4 tangent   : TANGENT;
#endif
    UNITY_VERTEX_INPUT_INSTANCE_ID
};

float4 TexCoords(VertexInput v)
{
    float4 texcoord;
    texcoord.xy = TRANSFORM_TEX(v.uv0, _MainTex); // Always source from uv0
    texcoord.zw = TRANSFORM_TEX(((_UVSec == 0) ? v.uv0 : v.uv1), _DetailNormalMap);
    return texcoord;
}

half3 Albedo(float4 texcoords)
{
    half3 albedo = _Color.rgb * tex2D (_MainTex, texcoords.xy).rgb;
    return albedo;
}

half Alpha(float2 uv)
{
//#if defined(_SMOOTHNESS_TEXTURE_ALBEDO_CHANNEL_A)
//    return _Color.a;
//#else
    return tex2D(_MainTex, uv).a * _Color.a;
//#endif
}

half Occlusion(float2 uv)
{
#if (SHADER_TARGET < 30)
    // SM20: instruction count limitation
    // SM20: simpler occlusion
    return tex2D(_OcclusionMap, uv).g;
#else
    half occ = tex2D(_OcclusionMap, uv).g;
    return LerpOneTo (occ, _OcclusionStrength);
#endif
}

half4 SpecularGloss(float2 uv)
{
    half4 sg;
//#ifdef _SPECGLOSSMAP
    //#if defined(_SMOOTHNESS_TEXTURE_ALBEDO_CHANNEL_A)
    //    sg.rgb = tex2D(_SpecGlossMap, uv).rgb * _Shininess;
    //    sg.a = tex2D(_MainTex, uv).a;
    //#else
//        sg = tex2D(_SpecGlossMap, uv);
//        sg.rgb *= _Shininess;
    //#endif
//    sg.a = sg.a * _GlossMapScale + _GlossMapBias;
//#else
//    sg.rgb = _SpecColor.rgb * _Shininess;
    //#ifdef _SMOOTHNESS_TEXTURE_ALBEDO_CHANNEL_A
    //    sg.a = tex2D(_MainTex, uv).a * _GlossMapScale + _GlossMapBias;
    //#else
//        sg.a = _Glossiness;
    //#endif
//#endif
    sg = tex2D(_SpecGlossMap, uv);
    sg.rgb *= _SpecColor.rgb * _Shininess;
    sg.a = sg.a * _Glossiness * _GlossMapScale + _GlossMapBias;
    return sg;
}

half2 MetallicGloss(float2 uv)
{
    half2 mg;

//#ifdef _METALLICGLOSSMAP
    //#ifdef _SMOOTHNESS_TEXTURE_ALBEDO_CHANNEL_A
    //    mg.r = tex2D(_MetallicGlossMap, uv).r;
    //    mg.g = tex2D(_MainTex, uv).a;
    //#else
//        mg = tex2D(_MetallicGlossMap, uv).ra;
    //#endif
//    mg.g = mg.g * _GlossMapScale + _GlossMapBias;
//#else
//    mg.r = _Metallic;
    //#ifdef _SMOOTHNESS_TEXTURE_ALBEDO_CHANNEL_A
    //    mg.g = tex2D(_MainTex, uv).a * _GlossMapScale + _GlossMapBias;
    //#else
//        mg.g = _Glossiness;
    //#endif
//#endif
    
    mg = tex2D(_MetallicGlossMap, uv).ra;
    mg.r *= _Metallic;
    mg.g = mg.g * _Glossiness * _GlossMapScale + _GlossMapBias;
    
    return mg;
}

half3 Emission(float2 uv)
{
//#ifndef _EMISSION
//   return 0;
//#else
    return tex2D(_EmissionMap, uv).rgb * _EmissionColor.rgb;
//#endif
}

#ifdef _NORMALMAP
half3 NormalInTangentSpace(float4 texcoords)
{
    half3 normalTangent = UnpackScaleNormal(tex2D (_BumpMap, texcoords.xy), _BumpScale);

#if _DETAIL_NORMAL
    half3 detailNormalTangent = UnpackScaleNormal(tex2D (_DetailNormalMap, texcoords.zw), _DetailNormalMapScale);
    normalTangent = lerp(
            normalTangent,
            BlendNormals(normalTangent, detailNormalTangent),
            1);
#endif

    return normalTangent;
}
#endif

float4 Parallax (float4 texcoords, half3 viewDir)
{
    // Disable parallax on ZEPETO built-in shader
    return texcoords;
}

#endif // ZEPETO_STANDARD_INPUT_INCLUDED