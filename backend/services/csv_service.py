# backend/services/csv_service.py
import csv

def analyze_csv(file_path: str) -> str:
    try:
        with open(file_path, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            columns = reader.fieldnames or []

        if not rows:
            return "CSV file is empty."

        summary_parts = []
        summary_parts.append(f"DATASET OVERVIEW")
        summary_parts.append(f"Rows: {len(rows)}")
        summary_parts.append(f"Columns: {len(columns)}")
        summary_parts.append(f"\nCOLUMNS: {', '.join(columns)}")

        summary_parts.append(f"\nFIRST 5 ROWS:")
        for row in rows[:5]:
            summary_parts.append(str(row))

        # Basic numeric stats without pandas
        for col in columns:
            values = []
            for row in rows:
                try:
                    values.append(float(row[col]))
                except (ValueError, TypeError):
                    pass
            if values:
                avg = sum(values) / len(values)
                summary_parts.append(
                    f"\n{col} — min: {min(values):.2f}, "
                    f"max: {max(values):.2f}, avg: {avg:.2f}"
                )

        return "\n".join(summary_parts)

    except Exception as e:
        return f"Error reading CSV: {str(e)}"