import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUploads, addUpload, setSelectedUpload } from '../store/uploadsSlice';
import api from '../utils/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { Upload, FileSpreadsheet, Calendar, Layers, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploads } = useSelector((state) => state.uploads);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const response = await api.get('/uploads');
      dispatch(setUploads(response.data));
    } catch (error) {
      toast.error('Failed to fetch uploads');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
        toast.error('Only .xls and .xlsx files are supported');
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast.error('File size exceeds 20MB limit');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(addUpload(response.data));
      toast.success('File uploaded successfully!');
      setSelectedFile(null);
      document.getElementById('file-input').value = '';
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSelectUpload = (upload) => {
    dispatch(setSelectedUpload(upload));
    navigate('/analytics');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Dashboard</h1>
          <p className="text-gray-700">Upload and manage your Excel files for analytics</p>
        </div>

        <Card className="mb-8 border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg" data-testid="upload-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2 text-blue-600" />
              Upload Excel File
            </CardTitle>
            <CardDescription>Upload .xls or .xlsx files (Max 20MB)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Input
                id="file-input"
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                className="flex-1"
                data-testid="file-input"
              />
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                data-testid="upload-button"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600" data-testid="selected-file-name">
                Selected: {selectedFile.name}
              </p>
            )}
          </CardContent>
        </Card>

        <Card data-testid="uploads-history-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="h-5 w-5 mr-2 text-blue-600" />
              Upload History
            </CardTitle>
            <CardDescription>
              {uploads.length} file{uploads.length !== 1 ? 's' : ''} uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploads.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileSpreadsheet className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No uploads yet. Upload your first Excel file to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {uploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleSelectUpload(upload)}
                    data-testid={`upload-item-${upload.id}`}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="p-2 bg-blue-100 rounded">
                        <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{upload.original_filename}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Layers className="h-3 w-3 mr-1" />
                            {upload.row_count} rows
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {upload.columns.length} columns
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(upload.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" data-testid={`analyze-button-${upload.id}`}>
                      Analyze
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
