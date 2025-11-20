import pandas as pd

qa_path = r"E:\webisdom - Copy\back\docs\restaurant_QA_500.csv"
menu_path = r"E:\webisdom - Copy\back\docs\menu.csv"

qa_df = pd.read_csv(qa_path)
menu_df = pd.read_csv(menu_path)

print("QA CSV columns:", qa_df.columns)
print("QA CSV head:", qa_df.head())
print("Menu CSV head:", menu_df.head())
