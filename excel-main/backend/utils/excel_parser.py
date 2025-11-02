import openpyxl
from typing import List, Dict, Any
from models.upload import ColumnData

def parse_excel_file(file_path: str) -> tuple[List[ColumnData], int]:
    """
    Parse an Excel file and return column data and row count.
    """
    try:
        workbook = openpyxl.load_workbook(file_path, data_only=True)
        sheet = workbook.active
        
        # Get headers from first row
        headers = []
        for cell in sheet[1]:
            if cell.value:
                headers.append(str(cell.value))
            else:
                break
        
        if not headers:
            return [], 0
        
        # Initialize column data
        columns_dict = {header: [] for header in headers}
        row_count = 0
        
        # Read data rows (skip header)
        for row in sheet.iter_rows(min_row=2, values_only=True):
            # Skip empty rows
            if not any(row):
                continue
            
            row_count += 1
            for idx, value in enumerate(row[:len(headers)]):
                if value is not None:
                    columns_dict[headers[idx]].append(value)
                else:
                    columns_dict[headers[idx]].append(None)
        
        # Convert to ColumnData list
        columns = [ColumnData(header=header, values=values) for header, values in columns_dict.items()]
        
        workbook.close()
        return columns, row_count
    
    except Exception as e:
        raise Exception(f"Failed to parse Excel file: {str(e)}")
