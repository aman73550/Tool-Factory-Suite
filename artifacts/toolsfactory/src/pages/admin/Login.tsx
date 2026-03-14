import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAdminLogin, useGetAdminMe } from '@workspace/api-client-react';
import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { data: admin } = useGetAdminMe({ query: { retry: false } });
  const loginMut = useAdminLogin();

  useEffect(() => {
    if (admin) setLocation('/admin/dashboard');
  }, [admin, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await loginMut.mutateAsync({ data: { email, password } });
      window.location.href = '/admin/dashboard'; // full reload to ensure auth cookie is sent in next reqs
    } catch (err: any) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-950 dark text-slate-50">
      <div className="absolute inset-0 opacity-20">
        <img src={`${import.meta.env.BASE_URL}images/admin-bg.png`} alt="Admin Background" className="w-full h-full object-cover" />
      </div>
      
      <Card className="w-full max-w-md relative z-10 bg-slate-900 border-slate-800 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="w-16 h-16 bg-primary/20 text-primary mx-auto rounded-2xl flex items-center justify-center">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <CardTitle className="text-2xl font-display">Admin Portal</CardTitle>
            <CardDescription className="text-slate-400">Sign in to manage ToolsFactory</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-slate-950 border-slate-800 h-12 text-slate-100" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-slate-950 border-slate-800 h-12 text-slate-100" 
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={loginMut.isPending}>
              {loginMut.isPending ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
