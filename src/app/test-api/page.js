"use client";

import React, { useState, useEffect } from "react";
import apiClient from "@/lib/api-client";

export default function TestAPIPage() {
  const [testResults, setTestResults] = useState({
    folders: null,
    error: null,
    loading: true
  });

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    console.log('TestAPI: Starting API test');
    setTestResults(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      console.log('TestAPI: Calling getStudentFolders()');
      const response = await apiClient.getStudentFolders();
      console.log('TestAPI: Got response:', response);
      
      setTestResults({
        folders: response,
        error: null,
        loading: false
      });
    } catch (error) {
      console.error('TestAPI: Error:', error);
      setTestResults({
        folders: null,
        error: error.message,
        loading: false
      });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>API Test Page</h1>
      
      <button onClick={testAPI} style={{ marginBottom: '20px', padding: '10px 20px' }}>
        Test API Again
      </button>
      
      <div>
        <h2>Test Results:</h2>
        
        {testResults.loading && <p>Loading...</p>}
        
        {testResults.error && (
          <div style={{ color: 'red', backgroundColor: '#ffeeee', padding: '10px' }}>
            <h3>Error:</h3>
            <pre>{testResults.error}</pre>
          </div>
        )}
        
        {testResults.folders && (
          <div style={{ backgroundColor: '#eeffee', padding: '10px' }}>
            <h3>Success!</h3>
            <pre>{JSON.stringify(testResults.folders, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
