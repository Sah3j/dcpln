import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

interface props {
  setActiveForm: React.Dispatch<React.SetStateAction<string>>,
}

const LoginPage: React.FC<props> = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const lower_email = email.toLowerCase()

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: lower_email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to log in');
      }

      const data = await response.json();
      login(data.access_token, { email, id: data.user_id, name: data.name, token: data.access_token });
      router.push('/'); // Redirect to the main page after successful login
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Optional: Simple email validation
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  return (
    <div className="">
      <form onSubmit={handleLogin}>
        <div>
          <Label htmlFor="email">Email:</Label>
          <Input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <Label htmlFor="password">Password:</Label>
          <Input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <Button type="submit" disabled={isLoading || !isValidEmail(email)} className='mt-4'>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
        {error && <p className='text-red'>{error}</p>}
      </form>
      <div className='w-full h-1 border-t mt-4 border-neutral-700'/>
      <Button variant="link" className='' onClick={() => props.setActiveForm('registration')}>
        New? Register for a new account
      </Button>
    </div>
  );
};

export default LoginPage;