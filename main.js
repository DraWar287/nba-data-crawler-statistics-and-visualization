
getTopData('./data/top_5_avg_score.json', 'top_5_score', 'TOP5 场均得分', 'Player', 'PTS');
getTopData('./data/top_5_avg_time.json', 'top_5_time', 'TOP5 场均出场时间', 'Player', 'MP');
getTopData('./data/top_5_avg_shot.json', 'top_5_shot', 'TOP5 场均投篮数', 'Player', 'FGA');
getTopData('./data/top_5_avg_freeThrows.json', 'top_5_freeThrows','TOP5 场均罚球数', 'Player', 'FTA')



/* 文件名， HTML元素id， 图表标题， x坐标， y坐标*/
/* 生成数据的TOP条形图 */
function getTopData(fileName, elementId, title_text, x_item, y_item) {
    fetch(fileName)
        .then(response => response.json())
        .then(data => {
            let myEchart = echarts.init(document.getElementById(elementId));
            let option = {
                title: {
                    text : title_text
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
