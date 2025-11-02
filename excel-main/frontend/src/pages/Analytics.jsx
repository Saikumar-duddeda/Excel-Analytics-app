import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Save, Sparkles, Download } from 'lucide-react';
import Navbar from '../components/Navbar';
import ChartViewer from '../components/ChartViewer';

const Analytics = () => {
  const { selectedUpload } = useSelector((state) => state.uploads);
  const navigate = useNavigate();

  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [chartTitle, setChartTitle] = useState('Chart');
  const [aiSummary, setAiSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!selectedUpload) {
      navigate('/dashboard');
      return;
    }

    if (selectedUpload.ai_summary) {
      setAiSummary(selectedUpload.ai_summary);
    }

    if (selectedUpload.chart_configs && selectedUpload.chart_configs.length > 0) {
      const lastConfig = selectedUpload.chart_configs[selectedUpload.chart_configs.length - 1];
      setXAxis(lastConfig.x_axis);
      setYAxis(lastConfig.y_axis);
      setChartType(lastConfig.chart_type);
      setChartTitle(lastConfig.title || 'Chart');
    } else if (selectedUpload.columns.length >= 2) {
      setXAxis(selectedUpload.columns[0].header);
      setYAxis(selectedUpload.columns[1].header);
    }
  }, [selectedUpload, navigate]);

  if (!selectedUpload) return null;

  const handleSaveConfig = async () => {
    if (!xAxis || !yAxis) {
      toast.error('Please select both X and Y axes');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/uploads/${selectedUpload.id}/config`, {
        x_axis: xAxis,
        y_axis: yAxis,
        chart_type: chartType,
        title: chartTitle,
        generate_ai_summary: false,
      });
      toast.success('Chart configuration saved!');
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAISummary = async () => {
    if (!xAxis || !yAxis) {
      toast.error('Please select both X and Y axes first');
      return;
    }

    setGenerating(true);
    try {
      const response = await api.post(`/uploads/${selectedUpload.id}/config`, {
        x_axis: xAxis,
        y_axis: yAxis,
        chart_type: chartType,
        title: chartTitle,
        generate_ai_summary: true,
      });
      setAiSummary(response.data.ai_summary);
      toast.success('AI summary generated!');
    } catch (error) {
      toast.error('Failed to generate AI summary');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
            data-testid="back-to-dashboard-button"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">{selectedUpload.original_filename}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card data-testid="chart-config-card">
              <CardHeader>
                <CardTitle>Chart Configuration</CardTitle>
                <CardDescription>Select axes and chart type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="x-axis">X-Axis Column</Label>
                  <Select value={xAxis} onValueChange={setXAxis}>
                    <SelectTrigger id="x-axis" data-testid="x-axis-select">
                      <SelectValue placeholder="Select X-axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedUpload.columns.map((col) => (
                        <SelectItem key={col.header} value={col.header} data-testid={`x-axis-option-${col.header}`}>
                          {col.header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="y-axis">Y-Axis Column</Label>
                  <Select value={yAxis} onValueChange={setYAxis}>
                    <SelectTrigger id="y-axis" data-testid="y-axis-select">
                      <SelectValue placeholder="Select Y-axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedUpload.columns.map((col) => (
                        <SelectItem key={col.header} value={col.header} data-testid={`y-axis-option-${col.header}`}>
                          {col.header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chart-type">Chart Type</Label>
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger id="chart-type" data-testid="chart-type-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar" data-testid="chart-type-bar">Bar Chart</SelectItem>
                      <SelectItem value="line" data-testid="chart-type-line">Line Chart</SelectItem>
                      <SelectItem value="scatter" data-testid="chart-type-scatter">Scatter Chart</SelectItem>
                      <SelectItem value="pie" data-testid="chart-type-pie">Pie Chart</SelectItem>
                      <SelectItem value="3d_column" data-testid="chart-type-3d">3D Column Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chart-title">Chart Title</Label>
                  <Input
                    id="chart-title"
                    value={chartTitle}
                    onChange={(e) => setChartTitle(e.target.value)}
                    placeholder="Enter chart title"
                    data-testid="chart-title-input"
                  />
                </div>

                <Button
                  onClick={handleSaveConfig}
                  disabled={loading || !xAxis || !yAxis}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  data-testid="save-config-button"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Configuration'}
                </Button>

                <Button
                  onClick={handleGenerateAISummary}
                  disabled={generating || !xAxis || !yAxis}
                  variant="outline"
                  className="w-full"
                  data-testid="generate-ai-summary-button"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {generating ? 'Generating...' : 'Generate AI Summary'}
                </Button>
              </CardContent>
            </Card>

            {aiSummary && (
              <Card data-testid="ai-summary-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {aiSummary}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <ChartViewer
              upload={selectedUpload}
              xAxis={xAxis}
              yAxis={yAxis}
              chartType={chartType}
              chartTitle={chartTitle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
