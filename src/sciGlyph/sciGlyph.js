import * as d3 from 'd3';
import {
    getCanvasMes,
    getRingPath,
    getRadialArea,
    getCircle,
    getTriangle
} from './primitive.js';

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
export const radialAreaGlyph = (canvas, config)=>{
    /********** 参数准备 **********/
    // 获取画布尺寸信息
    let {canvasWidth, canvasHeight, centerX, centerY} = getCanvasMes(canvas);
    // 计算外圆半径
    let outterRadius = canvasWidth < canvasHeight ? canvasWidth / 2 : canvasHeight / 2;
    // 设置比例尺
    let histogramScale = d3.scaleLinear()
        .domain([0, d3.max(config.histogramData)])
        .range([config.middleRadius, outterRadius]);
    let radialAreaScale = d3.scaleLinear()
        .domain([0, d3.max(config.radialAreaData)])
        .range([config.innerRadius, config.middleRadius]);
    // 添加组合容器g
    let elementsCollection = canvas.append('g');

    /********** 开始绘制 **********/
    /***** 绘制圆环 *****/
    // 路径生成
    let arcPath = getRingPath(config.innerRadius, config.middleRadius, 0, 2 * Math.PI);
    // 绘制路径
    elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .append('path')
        .attr('d', arcPath())
        .attr('fill', config.themeStyle)
        .attr('fill-opacity', config.opacityOfInnerRing);
    /***** 绘制径向柱状图 *****/
    // 路径数组
    let arcPathArr = [];
    // 创建路径
    config.histogramData.forEach((item, index)=>{
        arcPathArr.push(
            getRingPath(config.middleRadius, histogramScale(item), (index * 15) * (Math.PI / 180), (index * 15 + 15) * (Math.PI / 180)).padAngle(0.02)
        );
    });
    // 绘制路径
    elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .selectAll('path')
        .data(arcPathArr)
        .join('path')
        .attr('d', (d)=>{
            return d();
        })
        .attr('fill', config.themeStyle);
    /***** 绘制径向面积图 *****/
    // 平分角度
    let angles = d3.range(0, 2 * Math.PI, Math.PI / 48);
    // 创建径向面积生成器
    let area = getRadialArea(config.innerRadius, (_, i) => {
        return radialAreaScale(config.radialAreaData[i]);
    });
    // 绘制区域
    elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .append('path')
        .attr('d', area(angles))
        .attr("fill", config.themeStyle)
        .attr("fill-opacity", 0.7);
    /***** 绘制axis文本 *****/
    // 添加组元素g，包裹刻度
    let axisG = elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`);
    // 绘制刻度
    let axisMark = null;
    config.axisData.forEach((item)=>{
        axisMark = axisG.append('g')
            .attr('transform', `rotate(${-90 + item * 15}) translate(${config.middleRadius}, 0)`);
        axisMark.append('line')
            .attr('x2', -5)
            .attr('stroke', '#000')
            .attr('stroke-width', '1.5px');
        axisMark.append('text')
            .attr("text-anchor", "middle")
            .attr('transform', 'rotate(90) translate(0, 12)')
            .attr('font-size', config.axisFontSize)
            .text(`${item}h`);
    })
    /***** 绘制中心文本 *****/
    elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .append('text')
        .attr("text-anchor", "middle")
        .attr('font-size', config.centerTextFontSize)
        .attr('font-weight', 600)
        .attr('color', '#aaa')
        .text(config.centerText);
    /***** 绘制平均线 *****/
    getCircle(elementsCollection.append('g'), centerX, centerY, radialAreaScale(d3.mean(config.radialAreaData)))
        .attr('stroke', config.themeStyle)
        .attr('stroke-width', '2px')
        .attr("stroke-dasharray", 8 + " " + 4)
        .attr("fill", "none");
}

/*
    * container是D3 SVG画布实例;
    * config是配置对象,配置项及含义如下:
    {
        smallCircleSize: [11,8,45,21,2,34,79,50,25,0], //小圆尺寸
        pointerMax: 56.0204081632653, //指针最大值
        pointerMean: 26.506147994187383, //指针平均值
        innerArcMax: 100, //内圆弧最大值
        innerArcMean: 58, //内圆弧平均值
        upperArcMax: 100, //上圆弧最大值
        upperArcMean: 60, //上圆弧平均值
        lowerArcMax: 100, //下圆弧最大值
        lowerArcMean: 45, //下圆弧平均值
        centerRadius: 15, //中心圆半径
        outerRadius: 50, //外圆半径
        themeStyle: '', //主题颜色
        pointerFontSize: '16px', //指针字体大小
    }
*/
export const instrumentPanelGlyph = (canvas, config)=>{
    /********** 参数准备 **********/
    // 获取画布尺寸信息
    let {canvasWidth, canvasHeight, centerX, centerY} = getCanvasMes(canvas);
    // 添加组合容器g
    let elementsCollection = canvas.append('g');
    // 定义比例尺
    let pointerRotateScale = d3.scaleLinear()
        .domain([0, config.pointerMax])
        .range([60, 300]);
    let colorScale = d3.scaleLinear()
        .domain([0, config.pointerMax])
        .range(['#D3D4D5', config.themeStyle]);
    let sizeScale = d3.scaleLinear()
        .domain([0, d3.max(config.smallCircleSize)])
        .range([1, 9]);
    let innerArcScale = d3.scaleLinear()
        .domain([0, config.innerArcMax])
        .range([225, 135]);
    let upperArcScale = d3.scaleLinear()
        .domain([0, config.upperArcMax])
        .range([-45, 45]);
    let lowerArcScale = d3.scaleLinear()
        .domain([0, config.lowerArcMax])
        .range([-45, -135]);

    /********** 开始绘制 **********/
    // 绘制外圆
    getCircle(elementsCollection.append('g'), centerX, centerY, config.outerRadius)
        .attr('stroke', config.themeStyle)
        .attr('stroke-width', '2px')
        .attr("fill", "none");
    // 绘制圆心
    getCircle(elementsCollection.append('g'), centerX, centerY, config.centerRadius)
        .attr("fill", config.themeStyle);
    // 绘制指针
    getTriangle(
        elementsCollection.append('g').attr('transform', `translate(${centerX}, ${centerY})`),
        config.pointerCoord,
        pointerRotateScale(config.pointerMean)
    ).attr('fill', config.themeStyle)
    // 绘制指针表盘
    let arcPathArr = [];
    for (let i = 1; i <= 12; i++){
        arcPathArr.push(
            getRingPath(config.outerRadius - 20, config.outerRadius - 4, (20 * i - 140) * (Math.PI / 180), ((20 * i - 140) + 18) * (Math.PI / 180))
        );
    }
    elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .selectAll('path')
        .data(arcPathArr)
        .join('path')
        .attr('d', (d)=>{
            return d();
        })
        .attr('fill', (_, i)=>{
            return(colorScale((config.pointerMax / 12) * i))
        });
    // 绘制小圆
    let smallCircleG = elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`);
    config.smallCircleSize.forEach((item, index)=>{
        smallCircleG.append('g')
        .attr('transform', `rotate(${-130 + index * 15}) translate(0, ${config.outerRadius + 9})`)
        .append('circle')
        .attr('r', ()=>{
            return sizeScale(item);
        })
        .attr('fill', config.themeStyle);
    });
    // 绘制内圆弧
    let arcTotal = getRingPath(config.outerRadius - 18, config.outerRadius, 135 * (Math.PI / 180), 225 * (Math.PI / 180));
    elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .append('path')
        .attr('d', arcTotal)
        .attr('stroke', config.themeStyle)
        .attr('stroke-width', '2px')
        .attr('fill', 'none');
    // 绘制碳排放占比
    let arcCO2 = getRingPath(config.outerRadius - 18, config.outerRadius, 225 * (Math.PI / 180), innerArcScale(config.innerArcMean) * (Math.PI / 180));
    elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .append('path')
        .attr('d', arcCO2)
        .attr('stroke', config.themeStyle)
        .attr('stroke-width', '2px')
        .attr('fill', config.themeStyle);
    // 绘制上圆弧
    let upperArc = getRingPath(config.outerRadius, config.outerRadius + 18, -45 * (Math.PI / 180), upperArcScale(config.upperArcMean) * (Math.PI / 180));
    elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .append('path')
        .attr('d', upperArc)
        .attr('stroke', '#C1C2C4')
        .attr('stroke-width', '2px')
        .attr('fill', config.themeStyle);
    // 绘制下圆弧
    let lowerArc = getRingPath(config.outerRadius, config.outerRadius + 18, -45 * (Math.PI / 180), lowerArcScale(config.innerArcMean) * (Math.PI / 180));
    elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .append('path')
        .attr('d', lowerArc)
        .attr('stroke', '#C1C2C4')
        .attr('stroke-width', '2px')
        .attr('fill', config.themeStyle);
    // 绘制速度说明文字
    elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .append('g')
        .append('text')
        .attr('transform', `rotate(${60}) translate(0, ${config.outerRadius - 22})`)
        .attr("text-anchor", "middle")
        .attr('font-size', config.pointerFontSize)
        .attr('font-weight', 600)
        .attr('fill', '#bbb')
        .text(0);
    elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .append('g')
        .append('text')
        .attr('transform', `rotate(${-60}) translate(0, ${config.outerRadius - 22})`)
        .attr("text-anchor", "middle")
        .attr('font-size', config.pointerFontSize)
        .attr('font-weight', 600)
        .attr('fill', '#bbb')
        .text(config.pointerMax);
}
/*
    * container是D3 SVG画布实例;
    * config是配置对象,配置项及含义如下:
    {
        smallCircleSize: [11,8,45,21,2,34,79,50,25], //小圆数据
        outerRadius: 80, //外圆半径
        innerRadius: 30, //内圆半径
        outerArcData: [100, 50, 120, 98, 60, 21, 78, 55, 90, 200], //外圆弧数据
        innerArcData: [100, 50, 79, 20, 30], //内圆弧数据
        points: [...], //地图坐标点数据
        chinaMap: null, //地图geojson数据
        colors: ['#C54E83', '#4EBABC', '#F4A2B9', '#8FC1D9', '#FFC599'], //五种类型颜色
        smallCircleMarkColors: ['red', '#ccc', 'blue', '#ccc', '#ccc', '#ccc', '#ccc', '#ccc', '#ccc'], //小圆标记颜色
        themeStyle: 'blue', //主题颜色
        mapScale: 0.4, //地图缩放因子
        innerArcWidth: 10,
        pointsColors: {'HH': '#C54E83'}, //点的颜色
        pointR: 2 //点的半径
    }
*/
export const spatialDistribution = (canvas, config)=>{
    /********** 参数准备 **********/
    // 获取画布尺寸信息
    let {canvasWidth, canvasHeight, centerX, centerY} = getCanvasMes(canvas);
    // 添加组合容器g
    let elementsCollection = canvas.append('g');
    // 定义比例尺
    let outerArcScale = d3.scaleLinear()
        .domain([0, d3.max(config.outerArcData)])
        .range([config.innerRadius, config.outerRadius]);
    let innerArcScale = d3.scaleLinear()
        .domain([0, d3.max(config.innerArcData)])
        .range([0, 50]);
    let sizeScale = d3.scaleLinear()
        .domain([0, d3.max(config.smallCircleSize)])
        .range([0, 5]);

    /********** 开始绘制 **********/
    // 绘制外圆弧
    // 路径数组
    let arcPathArr = [];
    // 创建路径
    config.outerArcData.forEach((item, index)=>{
        arcPathArr.push(
            getRingPath(config.innerRadius, outerArcScale(item), (index * 36) * (Math.PI / 180), (index * 36 + 36) * (Math.PI / 180))
        );
    });
    // 绘制路径
    elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .selectAll('path')
        .data(arcPathArr)
        .join('path')
        .attr('d', (d)=>{
            return d();
        })
        .attr('fill', config.themeStyle)
        .style('stroke', '#fff');
    // 绘制内圆弧
    let angleCount = 0;
    // 路径数组
    arcPathArr = []
    // 创建路径
    config.innerArcData.forEach((item, _)=>{
        arcPathArr.push(
            getRingPath(config.innerRadius - config.innerArcWidth, config.innerRadius, angleCount * (Math.PI / 180), (angleCount + innerArcScale(item)) * (Math.PI / 180))
        );
        angleCount += innerArcScale(item);
    });
    // 绘制路径
    elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .selectAll('path')
        .data(arcPathArr)
        .join('path')
        .attr('d', (d)=>{
            return d();
        })
        .attr('fill', (_, i)=>{
            return config.colors[i];
        });
    // 绘制小圆
    let smallCircleG = elementsCollection.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`);
    config.smallCircleSize.forEach((item, index)=>{
        smallCircleG.append('g')
            .attr('transform', `rotate(${20 + index * 15}) translate(0, ${config.innerRadius - 5})`)
            .append('circle')
            .attr('r', ()=>{
                return sizeScale(item);
            })
            .attr('fill', config.smallCircleMarkColors[index]);
    });
    // 绘制地图
    let projection = d3.geoMercator()
        .center([107, 31])
        .scale(config.mapScale)
        .translate([centerX * 1.05, centerY * 1.1]);
    let path = d3.geoPath()
        .projection(projection);
    let mapContainer = elementsCollection.append('g');
    mapContainer.selectAll('path')
        .data(config.chinaMap.features)
        .enter()
        .append('path')
        .style('fill', '#eee')
        .attr('d', path);
    // 绘制地图上的点
    let locSvg = mapContainer.selectAll('location')
        .data(config.points)
        .enter()
        .append('g')
        .attr('transform', (d)=>{
            let coor = projection([d.lon, d.lat]);
            return `translate(${coor[0]}, ${coor[1]})`;
        });
    locSvg.append('circle')
        .attr('r', config.pointR)
        .attr('fill', (d, i)=>{
            return config.pointsColors[d.class];
        });
}