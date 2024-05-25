import pandas as pd
import json


def run():
    df = pd.read_csv('./data/nba_2023_per_game_stats.csv')

    # 前十数据： 场均得分，场均出场时间，场均投篮出手次数，场均罚球次数
    top_5_avg_score = df[['Player', 'Tm', 'PTS']].sort_values(
        by='PTS', ascending=False).head(5).dropna()
    top_5_avg_time = df[['Player', 'Tm', 'MP']].sort_values(
        by='MP', ascending=False).head(5).dropna()
    top_5_avg_shot = df[['Player', 'Tm', 'FGA']].sort_values(
        by='FGA', ascending=False).head(5).dropna()
    top_5_avg_freeThrows = df[['Player', 'Tm', 'FTA']].sort_values(
        by='FTA', ascending=False).head(5).dropna()

    top_5_avg_score['Player'] = top_5_avg_score.apply(
        lambda row: f"{row['Tm']}:{row['Player']}", axis=1)
    top_5_avg_time['Player'] = top_5_avg_time.apply(
        lambda row: f"{row['Tm']}:{row['Player']}", axis=1)
    top_5_avg_shot['Player'] = top_5_avg_shot.apply(
        lambda row: f"{row['Tm']}:{row['Player']}", axis=1)
    top_5_avg_freeThrows['Player'] = top_5_avg_freeThrows.apply(
        lambda row: f"{row['Tm']}:{row['Player']}", axis=1)

    with open('./data/top_5_avg_score.json', 'w') as jf:
        json.dump(top_5_avg_score.to_dict(orient='records'), jf, indent=4)
    with open('./data/top_5_avg_time.json', 'w') as jf:
        json.dump(top_5_avg_time.to_dict(orient='records'), jf, indent=4)
    with open('./data/top_5_avg_shot.json', 'w') as jf:
        json.dump(top_5_avg_shot.to_dict(orient='records'), jf, indent=4)
    with open('./data/top_5_avg_freeThrows.json', 'w') as jf:
        json.dump(top_5_avg_freeThrows.to_dict(orient='records'), jf, indent=4)

    print("<JSON文件生成成功>前十数据： 场均得分，场均出场时间，场均投篮出手次数，场均罚球次数")

    # 场均得分与场均出手次数
    selected_cols = df[['PTS', 'FGA']]
    selected_cols = selected_cols.dropna()  # 过滤空值
    data_dict = selected_cols.to_dict(orient='records')
    json_path = './data/score_shot.json'
    with open(json_path, 'w') as jf:
        json.dump(data_dict, jf, indent=4)
    print("<JSON文件生成成功> 场均得分与场均出手次数")

    # 场均出手次数和场均命中率
    selected_cols = df[['FGA', 'FG%']]
    selected_cols = selected_cols.dropna()  # 过滤空值
    data_dict = selected_cols.to_dict(orient='records')
    json_path = './data/score_hitrate.json'
    with open(json_path, 'w') as jf:
        json.dump(data_dict, jf, indent=4)
    print("<JSON文件生成成功> 场均出手次数和场均命中率")

    # 所有场均得分超过18的球员
    selected_cols = df[df['PTS'] > 18]
    selected_cols = selected_cols.dropna()  # 过滤空值
    # 计算每个位置场均得分超过18的球员
    position_counts = selected_cols.groupby('Pos').size()
    data_dict = position_counts.to_dict()
    json_path = './data/score_position_counts.json'
    with open(json_path, 'w') as jf:
        json.dump(data_dict, jf, indent=4)
    print("<JSON文件生成成功> 每个位置场均得分超过18的球员")

    # 各个年龄段各个位置的总得分
    selected_cols = df[(df['Age'] >= 20) & (df['Age'] <= 40)]
    selected_cols = selected_cols.dropna()  # 过滤空值
    age_groups = pd.cut(selected_cols['Age'], bins=range(
        20, 41, 5), right=False, labels=['20-24', '25-29', '30-34', '35-39'])
    grouped = selected_cols.groupby([age_groups, 'Pos'], observed=False)[
        'PTS'].sum().unstack(fill_value=0)
    dataset = {
        "source": [
            ['Age'] + list(grouped.columns)
        ]
    }
    for age_group in grouped.index:
        dataset["source"].append([age_group] + list(grouped.loc[age_group]))
    with open('./data/age_position_scores.json', 'w') as json_file:
        json.dump(dataset, json_file, indent=4)
    print("<JSON文件生成成功> 各个年龄段各个位置的总得分")
