"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OptimizationResponse {
  success: boolean;
  message: string;
  total_trains: number;
  eligible_trains: number;
  results: Array<{
    train_id: string;
    priority_score: number;
    eligible: boolean;
    status: string;
    fitness_days_left: number;
    reasons: string;
    recommendations: string;
    cleaning: {
      last_clean_end: string | null;
      clean_age_hours: number;
      today_clean_load: number;
    };
    maintenance: {
      open_work_orders: number;
      open_work_order_hours: number;
    };
  }>;
}

const Form = () => {
  const [files, setFiles] = useState({
    fitness_certificates_: null as File | null,
    work_order_maximo_: null as File | null,
    branding_schedule_: null as File | null,
    mileage_logs_: null as File | null,
    cleaning_schedule_: null as File | null,
    stabling_layout_: null as File | null,
    cleaning_schedule_prev_: null as File | null,
    maintainance_: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResponse | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (key: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [key]: file }));
    setError(''); // Clear error when file is selected
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check required files
    const requiredFiles = [
      'fitness_certificates_',
      'work_order_maximo_',
      'branding_schedule_',
      'mileage_logs_',
      'cleaning_schedule_'
    ];
    
    const missingFiles = requiredFiles.filter(key => !files[key as keyof typeof files]);
    if (missingFiles.length > 0) {
      setError(`Please upload required files: ${missingFiles.join(', ')}`);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Step 1: Send files to FastAPI optimization
      const formData = new FormData();
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      const optimizationResponse = await fetch('http://localhost:8000/api/run-optimization', {
        method: 'POST',
        body: formData,
      });

      if (!optimizationResponse.ok) {
        const errorData = await optimizationResponse.json();
        throw new Error(errorData.detail || `HTTP error! status: ${optimizationResponse.status}`);
      }

      const optimizationResult: OptimizationResponse = await optimizationResponse.json();
      console.log('FastAPI Response:', optimizationResult);

      if (!optimizationResult.success) {
        throw new Error(optimizationResult.message || 'Optimization failed');
      }

      // Step 2: Get user ID from token (you might need to adjust this based on your auth system)
      const tokenResponse = await fetch('/api/auth/me');
      let userId = 'default-user-id'; // fallback
      
      if (tokenResponse.ok) {
        const userData = await tokenResponse.json();
        userId = userData.id || userId;
      }

      // Step 3: Save results to database with proper structure
      const saveResponse = await fetch('/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          data: optimizationResult.results.map(item => ({
            train_id: item.train_id,
            priority_score: item.priority_score,
            eligible: item.eligible,
            status: item.status, // Make sure status is included
            fitness_days_left: item.fitness_days_left,
            reasons: item.reasons,
            recommendations: item.recommendations,
            // Ensure nested objects are properly structured
            cleaning: {
              last_clean_end: item.cleaning?.last_clean_end || null,
              clean_age_hours: item.cleaning?.clean_age_hours || 0,
              today_clean_load: item.cleaning?.today_clean_load || 0
            },
            maintenance: {
              open_work_orders: item.maintenance?.open_work_orders || 0,
              open_work_order_hours: item.maintenance?.open_work_order_hours || 0
            }
          }))
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || `Failed to save results: ${saveResponse.status}`);
      }

      const savedResult = await saveResponse.json();
      console.log('Saved to database:', savedResult);

      setResult(optimizationResult);
      
      // Optional: Redirect to dashboard after successful save
      // window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Error during optimization:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fileInputs = [
    { key: 'fitness_certificates_', label: 'Fitness Certificates', required: true },
    { key: 'work_order_maximo_', label: 'Work Order Maximo', required: true },
    { key: 'branding_schedule_', label: 'Branding Schedule', required: true },
    { key: 'mileage_logs_', label: 'Mileage Logs', required: true },
    { key: 'cleaning_schedule_', label: 'Cleaning Schedule', required: true },
    { key: 'stabling_layout_', label: 'Stabling Layout', required: false },
    { key: 'cleaning_schedule_prev_', label: 'Previous Cleaning Schedule', required: false },
    { key: 'maintainance_', label: 'Maintenance Data', required: false },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Train Optimization Data Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fileInputs.map(({ key, label, required }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>
                    {label} {required && <span className="text-red-500">*</span>}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id={key}
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileChange(key, e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {files[key as keyof typeof files] && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              {loading ? 'Processing...' : 'Run Optimization'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Optimization Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Total Trains:</strong> {result.total_trains}</p>
              <p><strong>Eligible Trains:</strong> {result.eligible_trains}</p>
              <p className="text-sm text-gray-600">{result.message}</p>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={() => window.location.href = '/dashboard'} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Form;