import requests
from bs4 import BeautifulSoup
import pandas as pd


def run():
    url = 'https://www.basketball-reference.com/leagues/NBA_2023_per_game.html'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    print("2023NBA球员数据爬取成功!")
    # 找到数据表
    table = soup.find('table', {'id': 'per_game_stats'})
    df = pd.read_html(str(table))[0]
    df = df.drop(df[df['Player'] == 'Player'].index)  # 移除重复表头行

    # 保存为 CSV 文件

    df.to_csv('./data/nba_2023_per_game_stats.csv', index=False)
    print("<CSV文件生成成功>:./data/nba_2023_per_game_stats.csv")
