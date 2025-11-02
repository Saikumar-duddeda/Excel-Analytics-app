import React, { useRef } from 'react';
import { Bar, Line, Scatter, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import api from '../utils/api';
import { toast } from 'sonner';
import ThreeColumn3D from './ThreeColumn3D';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartViewer = ({ upload, xAxis, yAxis, chartType, chartTitle }) => {
  const chartRef = useRef(null);

  if (!xAxis || !yAxis) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center text-gray-500 py-20">
          <p>Please select X and Y axes to view the chart</p>
        </CardContent>
      </Card>
    );
  }

  const xCol = upload.columns.find((col) => col.header === xAxis);
  const yCol = upload.columns.find((col) => col.header === yAxis);

  if (!xCol || !yCol) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center text-red-500 py-20">
          <p>Selected columns not found</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: xCol.values.map((v) => String(v)),
    datasets: [
      {
        label: yAxis,
        data: yCol.values,
        backgroundColor: chartType === 'pie' 
          ? [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(249, 115, 22, 0.8)',
              'rgba(236, 72, 153, 0.8)',
              'rgba(168, 85, 247, 0.8)',
              'rgba(234, 179, 8, 0.8)',
            ]
          : 'rgba(59, 130, 246, 0.8)',
        borderColor: chartType === 'pie'
          ? [
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(249, 115, 22, 1)',
              'rgba(236, 72, 153, 1)',
              'rgba(168, 85, 247, 1)',
              'rgba(234, 179, 8, 1)',
            ]
          : 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: chartTitle,
        font: {
          size: 18,
          weight: 'bold',
        },
      },
    },
  };

  const handleDownloadPNG = async () => {
    try {
      const chartElement = chartRef.current;
      const canvas = await html2canvas(chartElement);
      const dataUrl = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.download = `${chartTitle.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      
      toast.success('PNG downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download PNG');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const chartElement = chartRef.current;
      const canvas = await html2canvas(chartElement);
      const dataUrl = canvas.toDataURL('image/png');
      
      const response = await api.post(
        `/uploads/${upload.id}/download/pdf`,
        { image: dataUrl, title: chartTitle },
        { responseType: 'blob' }
      );
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${chartTitle.replace(/\s+/g, '_')}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'scatter':
        return <Scatter data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case '3d_column':
        return <ThreeColumn3D xData={xCol.values} yData={yCol.values} title={chartTitle} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <Card data-testid="chart-viewer-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Chart Visualization</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPNG}
              data-testid="download-png-button"
            >
              <Download className="h-4 w-4 mr-1" />
              PNG
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              data-testid="download-pdf-button"
            >
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="w-full" style={{ height: '500px' }} data-testid="chart-container">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartViewer;
