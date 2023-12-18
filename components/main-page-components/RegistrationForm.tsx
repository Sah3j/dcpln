import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

interface props {
  setActiveForm: React.Dispatch<React.SetStateAction<string>>,
}

const RegistrationForm: React.FC<props> = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const lower_email = email.toLowerCase()

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/register-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: name, email: lower_email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      // You might want to automatically log in the user after registration
      // or redirect them to the login page
      props.setActiveForm('login'); // Redirect to the login page
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Optional: Simple email validation
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  return (
    <div>
      <form onSubmit={handleRegister}>
        <div>
          <Label htmlFor="name">Name:</Label>
          <Input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
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
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
        {error && <p className='text-red'>{error}</p>}
      </form>
      <div className='w-full h-1 border-t mt-4 border-neutral-700'/>
      <Button variant="link" className='' onClick={() => props.setActiveForm('login')}>
        Already have an account? Sign in.
      </Button>
    </div>
  );
};

export default RegistrationForm;
