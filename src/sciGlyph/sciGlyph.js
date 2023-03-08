/*
 * @Author: Dongliang Ma
 * @Date: 2023-03-07 13:19:59
 * @LastEditTime: 2023-03-08 13:42:16
 * @LastEditors: Dongliang Ma
 * @Description: 一个常用的可视化论文图标库
 * @GitHub: https://github.com/xianghui-ma
 * @Email: ma_dong_liang@163.com
 */

import * as d3 from 'd3';

/*
    * container是D3 SVG画布实例;
    * config是配置对象,配置项及含义如下:
    {
        histogramData: [1, 2, 3, ...], //柱状图数据
        radialAreaData: [1, 2, 3, ...], //径向面积图数据
        axisData: ['text1', 'text2', 'text3', ...], //径向轴文本标记数据
        themeStyle: '#000', //设置主题颜色
        centerText: 'text', //设置中心文本
        opacityOfInnerRing: 0.5, //内圆环透明度
        innerRadius: 1, //内圆半径
        middleRadius: 1 //中间圆半径
    }
*/
export const radialAreaGlyph = (container, config)=>{
    /********** 参数准备 **********/
    // 获取画布尺寸
    let containerWidth = container.attr('width');
    let containerHeight = container.attr('height');
    // 计算外圆半径
    let outterRadius = containerWidth < containerHeight ? containerWidth / 2 : containerHeight / 2;
    // 设置比例尺
    let histogramScale = d3.scaleLinear()
        .domain([0, d3.max(config.histogramData)])
        .range([config.middleRadius, outterRadius]);
    let radialAreaScale = d3.scaleLinear()
        .domain([0, d3.max(config.radialAreaData)])
        .range([config.innerRadius, config.middleRadius]);
    // 添加组合容器g
    let elementsCollection = container.append('g');

    /********** 开始绘制 **********/
    // 绘制圆环
    let arcPath = d3.arc()
        .innerRadius(config.innerRadius)
        .outterRadius(config.middleRadius)
        .startAngle(0)
        .endAngle(2 * Math.PI);
    elementsCollection.append('g')
        .append('path')
        .attr('d', arcPath())
        .attr('fill', config.themeStyle)
        .attr('fill-opacity', config.opacityOfInnerRing);
}