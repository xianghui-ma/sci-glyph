<h2 align="center">sciGlyph</h2>

在搭建论文中的可视化系统时，发现有诸多可视化图标设计可以被复用，故基于**D3.js**封装了一个**sciGlyph**库。

### 图标展示
***

<img src="https://raw.githubusercontent.com/xianghui-ma/staticImage/master/sci-glyph.png"/>

### 用法
***

**Step1:** 首先下载npm包：
`npm i sci-glyph`

**Step2:** 引入方法：
`import {instrumentPanelGlyph, radialAreaGlyph, spatialDistribution} from 'sci-glyph'`

**Step3:** 每个方法调用需要传入两个参数：
- `canvas`**D3**画布实例。
- `option`图形的配置项对象。每个图形的配置项如下面所述。

#### instrumentPanelGlyph

| 配置项 | 含义 | 值类型 |
| :----: | :----: | :----: |
| smallCircleSize | 外围小圆所表示的数据 | Array |
| pointerMax | 指针所表示数据的最大值 | Number |
| pointerMean | 指针数值 | Number |
| innerArcMax | 内圆弧最大值 | Number |
| innerArcMean | 内圆弧数值 | Number |
| upperArcMax | 上圆弧最大值 | Number |
| upperArcMean | 上圆弧数值 | Number |
| lowerArcMax | 下圆弧最大值 | Number |
| lowerArcMean | 下圆弧数值 | Number |
| centerRadius | 中心圆半径 | Number |
| outerRadius | 外圆半径 | Number |
| themeStyle | 主题颜色 | String |
| pointerFontSize | 字体大小 | String |

#### radialAreaGlyph

| 配置项 | 含义 | 值类型 |
| :----: | :----: | :----: |
| histogramData | 外围柱状图数据 | Array |
| radialAreaData | 径向面积图数据 | Array |
| axisData | 径向轴文本标记数据 | Array |
| themeStyle | 主题颜色 | String |
| centerText | 圆心文本 | String |
| opacityOfInnerRing | 内圆环透明度 | Number |
| innerRadius | 内圆半径 | Number |
| middleRadius | 中间圆半径 | Number |
| centerTextFontSize | 中心文本字体大小 | String |
| axisFontSize | 标记文本字体大小 | String |

#### spatialDistribution

| 配置项 | 含义 | 值类型 |
| :----: | :----: | :----: |
| smallCircleSize | 内层小圆所表示的数据 | Array |
| outerRadius | 外圆半径 | Number |
| innerRadius | 内圆半径 | Number |
| outerArcData | 外围圆弧数据 | Array |
| innerArcData | 内层圆弧数据 | Array |
| points | 地图中的点数据 | Array |
| chinaMap | 地图Geojson数据 | Geojson |
| colors | 类别颜色数组 | Array |
| smallCircleMarkColors | 内层小圆颜色 | Array |
| themeStyle | 主题颜色 | String |
| mapScale | 地图缩放 | Number |
| innerArcWidth | 内层圆弧宽度 | Number |
| pointsColors | 地图中点的颜色数组 | Object |
| pointR | 地图中的点的半径 | Number |

### 示例

```
import {instrumentPanelGlyph, radialAreaGlyph, spatialDistribution} from 'sci-glyph';

let canvas = d3.select(`#${containerId}`)
    .append('svg')
    .attr('width', 200)
    .attr('height', 210);

instrumentPanelGlyph(canvas, {
    smallCircleSize: [11,8,45,21,2,34,79,50,25,0],
    pointerMax: 56.0204081632653,
    pointerMean: 26.506147994187383,
    innerArcMax: 100,
    innerArcMean: 58,
    upperArcMax: 100,
    upperArcMean: 60,
    lowerArcMax: 100,
    lowerArcMean: 45,
    centerRadius: 15,
    outerRadius: 50,
    themeStyle: '#5B9BD5',
    pointerFontSize: '16px'
});
```