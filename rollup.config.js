/*
 * @Author: Dongliang Ma
 * @Date: 2023-03-07 10:22:25
 * @LastEditTime: 2023-03-08 21:40:07
 * @LastEditors: Dongliang Ma
 * @Description: 一个常用的可视化论文图标库
 * @GitHub: https://github.com/xianghui-ma
 * @Email: ma_dong_liang@163.com
 */
import babel from 'rollup-plugin-babel';

export default{
    input: './src/index.js',
    output: {
        file: './lib/bundle.js',
        format: 'cjs'
    },
    plugins: [babel()],
    external: ['d3']
}