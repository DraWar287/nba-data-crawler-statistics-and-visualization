
getTopData('./data/top_5_avg_score.json', 'top_5_score', 'TOP5 场均得分', 'Player', 'PTS');
getTopData('./data/top_5_avg_time.json', 'top_5_time', 'TOP5 场均出场时间', 'Player', 'MP');
getTopData('./data/top_5_avg_shot.json', 'top_5_shot', 'TOP5 场均投篮数', 'Player', 'FGA');
getTopData('./data/top_5_avg_freeThrows.json', 'top_5_freeThrows', 'TOP5 场均罚球数', 'Player', 'FTA');

displayPie('./data/score_position_counts.json', 'score_position', '各位置场均得分超过18的人数', 'Pos');

displayScatter('./data/shot_hitrate.json', 'shot_hitrate', '场均投篮出手数与投篮命中率', 'FGA', 'FG%')
displayScatter('./data/score_shot.json', 'score_shot', '场均得分与投篮数', 'PTS', 'FGA')

link_3('data/age_position_scores.json', 'age_position_score')

/* 文件名， HTML元素id， 图表标题， x坐标， y坐标*/
/* 生成TOP数据的条形图 */
function getTopData(fileName, elementId, title_text, x_item, y_item) {
    fetch(fileName)
        .then(response => response.json())
        .then(data => {
            let myEchart = echarts.init(document.getElementById(elementId));
            let option = {
                title: {
                    text: title_text
                },
                tooltip: {},
                legend: {
                    data: [y_item]
                },
                xAxis: {
                    data: data.map(item => item[x_item])
                },
                yAxis: {},
                series: [{
                    name: y_item,
                    type: 'bar',
                    data: data.map(item => item[y_item])
                }]
            };
            myEchart.setOption(option);
        })
        .catch(error => console.log("Error fetching data:", error));
    console.log(`<图表生成成功>: ${title_text}`);
}

function displayPie(fileName, elementId, title_text, pieName) {
    fetch(fileName)
        .then(response => response.json())
        .then(
            data => {
                let myEchart = echarts.init(document.getElementById(elementId));
                let option = {
                    title: {
                        text: title_text
                    },
                    series: [{
                        name: pieName,
                        type: 'pie',
                        radius: '55%',
                        data: Object.entries(data).map(([name, value]) => ({ name, value }))
                    }]
                }
                console.log(data);
                myEchart.setOption(option);
            }
        )
        .catch(error => console.log("Error fetching data:", error));
    console.log(`<图表生成成功>: ${title_text}`);
}

function displayScatter(fileName, elementId, title_text, xName, yName) {
    let myChart = echarts.init(document.getElementById(elementId));
    // 导入JSON文件
    fetch(fileName)
        .then(response => response.json())
        .then(data => {
            // 使用导入的数据生成散点图
            let option = {
                title: {
                    text: title_text
                },
                xAxis: {
                    type: 'value',
                    name: xName
                },
                yAxis: {
                    type: 'value',
                    name: yName
                },
                series: [{
                    data: data.map(item => [item[xName], item[yName]]),
                    type: 'scatter'
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        })
        .catch(error => console.error('Error fetching JSON:', error));
    console.log(`<图表生成成功>: ${title_text}`)
}

function link_3(fileName, elementId) {
    let myChart = echarts.init(document.getElementById(elementId));
    fetch(fileName)
        .then(response => response.json())
        .then(data => setTimeout(function () {
            option = {
                legend: {},
                tooltip: {
                    trigger: 'axis',
                    showContent: false
                },
                dataset: {
                    source: data['source']
                },
                xAxis: { type: 'category' },
                yAxis: { gridIndex: 0 },
                grid: { top: '55%' },
                series: [
                    { type: 'line', smooth: true, seriesLayoutBy: 'row' },
                    { type: 'line', smooth: true, seriesLayoutBy: 'row' },
                    { type: 'line', smooth: true, seriesLayoutBy: 'row' },
                    { type: 'line', smooth: true, seriesLayoutBy: 'row' },
                    {
                        type: 'pie',
                        id: 'pie',
                        radius: '30%',
                        center: ['50%', '25%'],
                        label: {
                            formatter: '{b}: {@2012} ({d}%)'
                        },
                        encode: {
                            itemName: 'product',
                            value: '2012',
                            tooltip: '2012'
                        }
                    }
                ]
            };

            myChart.on('updateAxisPointer', function (event) {
                let xAxisInfo = event.axesInfo[0];
                if (xAxisInfo) {
                    let dimension = xAxisInfo.value + 1;
                    myChart.setOption({
                        series: {
                            id: 'pie',
                            label: {
                                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                            },
                            encode: {
                                value: dimension,
                                tooltip: dimension
                            }
                        }
                    });
                }
            });

            myChart.setOption(option);

        }))
}