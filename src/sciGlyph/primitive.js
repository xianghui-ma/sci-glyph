/*
 * @Author: Dongliang Ma
 * @Date: 2023-03-07 13:19:59
 * @LastEditTime: 2023-03-10 13:12:27
 * @LastEditors: Dongliang Ma
 * @Description: 一个常用的可视化论文图标库
 * @GitHub: https://github.com/xianghui-ma
 * @Email: ma_dong_liang@163.com
 */

import * as d3 from 'd3';

// 获取画布尺寸信息
export const getCanvasMes = (canvas)=>{
    let canvasWidth = canvas.attr('width');
    let canvasHeight = canvas.attr('height');
    return {
        canvasWidth,
        canvasHeight,
        centerX: canvasWidth / 2,
        centerY: canvasHeight / 2
    }
}

// 创建圆环路径
export const getRingPath = (innerR, outerR, beginAngle, finishAngle)=>{
    return d3.arc()
        .innerRadius(innerR)
        .outerRadius(outerR)
        .startAngle(beginAngle)
        .endAngle(finishAngle);
}

// 创建径向面积生成器
export const getRadialArea = (innerR, outerRFun)=>{
    return d3.areaRadial()
        .curve(d3.curveLinearClosed)
        .angle((d) => { return d })
        .innerRadius(innerR)
        .outerRadius(outerRFun);
}

// 绘制圆
export const getCircle = (g, x, y, r)=>{
    return g.append('circle')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", r);
}

// 绘制三角形
export const getTriangle = (g, coord, rotate)=>{
    return g.append('polygon')
        .attr('points', coord)
        .attr('transform', `rotate(${rotate})`);
}