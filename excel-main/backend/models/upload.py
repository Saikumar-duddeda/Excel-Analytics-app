from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any
from datetime import datetime, timezone
import uuid

class ColumnData(BaseModel):
    header: str
    values: List[Any]

class ChartConfig(BaseModel):
    x_axis: str
    y_axis: str
    chart_type: str  # "bar", "line", "scatter", "pie", "3d_column"
    title: Optional[str] = "Chart"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Upload(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    filename: str
    original_filename: str
    file_size: int
    columns: List[ColumnData] = []
    row_count: int = 0
    chart_configs: List[ChartConfig] = []
    ai_summary: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UploadResponse(BaseModel):
    id: str
    user_id: str
    filename: str
    original_filename: str
    file_size: int
    columns: List[ColumnData]
    row_count: int
    chart_configs: List[ChartConfig]
    ai_summary: Optional[str]
    created_at: datetime
    updated_at: datetime

class SaveChartConfigRequest(BaseModel):
    x_axis: str
    y_axis: str
    chart_type: str
    title: Optional[str] = "Chart"
    generate_ai_summary: bool = False
