from typing import List
from models.upload import ColumnData
import os
import json
import asyncio
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

async def generate_ai_summary(columns: List[ColumnData], x_axis: str, y_axis: str) -> str:
    """
    Generate AI summary for the dataset using OpenAI GPT-4 (replacing Emergent LLM).
    """
    try:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return "AI summary generation is disabled. No OpenAI API key configured."

        client = OpenAI(api_key=api_key)

        # Prepare data sample for AI analysis
        x_col = next((col for col in columns if col.header == x_axis), None)
        y_col = next((col for col in columns if col.header == y_axis), None)

        if not x_col or not y_col:
            return "Unable to generate summary: columns not found."

        # Take sample of data (first 50 rows max)
        sample_size = min(50, len(x_col.values))
        data_sample = [
            {x_axis: x_col.values[i], y_axis: y_col.values[i]}
            for i in range(sample_size)
        ]

        # Build prompt
        prompt = f"""
        Analyze this Excel data and provide a brief summary (3–5 bullet points)
        of key insights, trends, patterns, or correlations.

        Data columns: {x_axis} (X-axis) and {y_axis} (Y-axis)
        Sample data ({sample_size} rows):
        {json.dumps(data_sample, indent=2)}

        Provide actionable insights in a concise format.
        """

        # Run the OpenAI call in a thread (non-blocking for async)
        response = await asyncio.to_thread(
            client.chat.completions.create,
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a data analyst expert. Provide concise insights from data."},
                {"role": "user", "content": prompt},
            ],
        )

        summary = response.choices[0].message.content.strip()
        return summary

    except Exception as e:
        return f"Failed to generate AI summary: {str(e)}"
