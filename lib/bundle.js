'use strict';

var d3 = require('d3');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var d3__namespace = /*#__PURE__*/_interopNamespace(d3);

/*
 * @Author: Dongliang Ma
 * @Date: 2023-03-07 13:19:59
 * @LastEditTime: 2023-03-09 10:13:42
 * @LastEditors: Dongliang Ma
 * @Description: 一个常用的可视化论文图标库
 * @GitHub: https://github.com/xianghui-ma
 * @Email: ma_dong_liang@163.com
 */

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
        middleRadius: 1, //中间圆半径
        centerTextFontSize: '16px', //中心文本字体大小
        axisFontSize: '12px' //标记文本字体大小
    }
*/
const radialAreaGlyph = (container, config) => {
  /********** 参数准备 **********/
  // 获取画布尺寸
  let containerWidth = container.attr('width');
  let containerHeight = container.attr('height');
  // 获取画布中心坐标
  let centerX = containerWidth / 2;
  let centerY = containerHeight / 2;
  // 计算外圆半径
  let outterRadius = containerWidth < containerHeight ? containerWidth / 2 : containerHeight / 2;
  // 设置比例尺
  let histogramScale = d3__namespace.scaleLinear().domain([0, d3__namespace.max(config.histogramData)]).range([config.middleRadius, outterRadius]);
  let radialAreaScale = d3__namespace.scaleLinear().domain([0, d3__namespace.max(config.radialAreaData)]).range([config.innerRadius, config.middleRadius]);
  // 添加组合容器g
  let elementsCollection = container.append('g');

  /********** 开始绘制 **********/
  /***** 绘制圆环 *****/
  // 路径生成
  let arcPath = d3__namespace.arc().innerRadius(config.innerRadius).outerRadius(config.middleRadius).startAngle(0).endAngle(2 * Math.PI);
  // 绘制路径
  elementsCollection.append('g').attr('transform', `translate(${centerX}, ${centerY})`).append('path').attr('d', arcPath()).attr('fill', config.themeStyle).attr('fill-opacity', config.opacityOfInnerRing);
  /***** 绘制径向柱状图 *****/
  // 路径数组
  let arcPathArr = [];
  // 创建路径
  config.histogramData.forEach((item, index) => {
    arcPathArr.push(d3__namespace.arc().innerRadius(config.middleRadius).outerRadius(histogramScale(item)).startAngle(index * 15 * (Math.PI / 180)).endAngle((index * 15 + 15) * (Math.PI / 180)).padAngle(0.02));
  });
  // 绘制路径
  elementsCollection.append('g').attr('transform', `translate(${centerX}, ${centerY})`).selectAll('path').data(arcPathArr).join('path').attr('d', d => {
    return d();
  }).attr('fill', config.themeStyle);
  /***** 绘制径向面积图 *****/
  // 平分角度
  let angles = d3__namespace.range(0, 2 * Math.PI, Math.PI / 48);
  // 创建径向面积生成器
  let area = d3__namespace.areaRadial().curve(d3__namespace.curveLinearClosed).angle(d => {
    return d;
  }).innerRadius(config.innerRadius).outerRadius((_, i) => {
    return radialAreaScale(config.radialAreaData[i]);
  });
  // 绘制区域
  elementsCollection.append('g').attr('transform', `translate(${centerX}, ${centerY})`).append('path').attr('d', area(angles)).attr("fill", config.themeStyle).attr("fill-opacity", 0.7);
  /***** 绘制axis文本 *****/
  // 添加组元素g，包裹刻度
  let axisG = elementsCollection.append('g').attr('transform', `translate(${centerX}, ${centerY})`);
  // 绘制刻度
  let axisMark = null;
  config.axisData.forEach(item => {
    axisMark = axisG.append('g').attr('transform', `rotate(${-90 + item * 15}) translate(${config.middleRadius}, 0)`);
    axisMark.append('line').attr('x2', -5).attr('stroke', '#000').attr('stroke-width', '1.5px');
    axisMark.append('text').attr("text-anchor", "middle").attr('transform', 'rotate(90) translate(0, 12)').attr('font-size', config.axisFontSize).text(`${item}h`);
  });
  /***** 绘制中心文本 *****/
  elementsCollection.append('g').attr('transform', `translate(${centerX}, ${centerY})`).append('text').attr("text-anchor", "middle").attr('font-size', config.centerTextFontSize).attr('font-weight', 600).attr('color', '#aaa').text(config.centerText);
  /***** 绘制平均线 *****/
  elementsCollection.append('g').append('circle').attr("cx", centerX).attr("cy", centerY).attr("r", radialAreaScale(d3__namespace.mean(config.radialAreaData))).attr('stroke', config.themeStyle).attr('stroke-width', '2px').attr("stroke-dasharray", 8 + " " + 4).attr("fill", "none");
};

/*
 * @Author: Dongliang Ma
 * @Date: 2023-03-07 10:21:31
 * @LastEditTime: 2023-03-07 20:34:01
 * @LastEditors: Dongliang Ma
 * @Description: 一个常用的可视化论文图标库
 * @GitHub: https://github.com/xianghui-ma
 * @Email: ma_dong_liang@163.com
 */
var index = {
  radialAreaGlyph
};

module.exports = index;
