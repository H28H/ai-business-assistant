# backend/services/csv_service.py
# Reads CSV files and generates a structured summary for the AI to analyze.

import pandas as pd


def analyze_csv(file_path: str) -> str:
    """
    Load a CSV file and create a structured summary including:
    - Column names and data types
    - Row count
    - Sample data
    - Basic statistics for numeric columns
    """
    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        return f"Error reading CSV: {str(e)}"
    
    summary_parts = []
    
    # Basic info
    summary_parts.append(f"DATASET OVERVIEW")
    summary_parts.append(f"Rows: {len(df)}")
    summary_parts.append(f"Columns: {len(df.columns)}")
    summary_parts.append("")
    
    # Column details
    summary_parts.append("COLUMNS:")
    for col in df.columns:
        dtype = str(df[col].dtype)
        null_count = df[col].isnull().sum()
        summary_parts.append(f"  - {col} ({dtype}) | {null_count} missing values")
    
    # Numeric statistics
    numeric_cols = df.select_dtypes(include=['number'])
    if not numeric_cols.empty:
        summary_parts.append("\nNUMERIC STATISTICS:")
        stats = numeric_cols.describe().round(2)
        summary_parts.append(stats.to_string())
    
    # Sample rows
    summary_parts.append("\nFIRST 5 ROWS:")
    summary_parts.append(df.head(5).to_string())
    
    return "\n".join(summary_parts)