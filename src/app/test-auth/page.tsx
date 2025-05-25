"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { testLogin, testRegistration, testForgotPassword, testResetPassword } from "@/lib/test-auth";

export default function TestAuthPage() {
  const [results, setResults] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const runTest = async (testFn: () => Promise<any>) => {
    setIsLoading(true);
    try {
      const result = await testFn();
      setResults(prev => `${prev}\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setResults(prev => `${prev}\nError: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runResetPasswordTest = async () => {
    if (!token) {
      setResults(prev => `${prev}\nError: Token is required for reset password test`);
      return;
    }

    setIsLoading(true);
    try {
      const result = await testResetPassword(token);
      setResults(prev => `${prev}\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setResults(prev => `${prev}\nError: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Tests</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Button 
          onClick={() => runTest(testLogin)} 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Test Login
        </Button>
        
        <Button 
          onClick={() => runTest(testRegistration)} 
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          Test Registration
        </Button>
        
        <Button 
          onClick={() => runTest(testForgotPassword)} 
          disabled={isLoading}
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          Test Forgot Password
        </Button>
        
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <Input 
              type="text" 
              placeholder="Enter reset token" 
              value={token} 
              onChange={(e) => setToken(e.target.value)} 
            />
            <Button 
              onClick={runResetPasswordTest} 
              disabled={isLoading || !token}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Test Reset Password
            </Button>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>Results from the authentication API calls</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto h-96 text-xs">
            {results || "Run a test to see results..."}
          </pre>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => setResults("")}>Clear Results</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 