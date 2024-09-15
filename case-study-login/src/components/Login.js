import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const formSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(50, "Username can't exceed 50 characters"),
  password: z
    .string()
    .min(2, 'Password must be at least 2 characters')
    .max(50, "Password can't exceed 50 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  console.log('Form object:', form); // Add this line to inspect the form object

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      const { username, password } = data;

      const response = await axios.post(
        'http://localhost:5185/api/RetailAPI/authenticate',
        { Username: username, Password: password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const token = response.data.token;

      localStorage.setItem('token', token);

      const getUserDetails = await axios.get(
        `http://localhost:5185/api/RetailAPI/${username}/${password}`
      );
      console.log(getUserDetails.data);
      const userData = {
        UserId: getUserDetails.data, // Adjust the property name as per your API response
      };
      console.log(userData.UserId);
      localStorage.setItem('userData', userData.UserId.userId);

      navigate('/products');
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      setError('Invalid username or password');
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/signing');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div
      className="flex items-center justify-center h-screen -z-10"
      style={{
        backgroundImage: `url('/login-background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white space-y-6  w-1/3 p-8 border  rounded-lg shadow-2xl z-10">
        <div className="text-3xl font-bold pb-2">Log In</div>
        <Form {...form}>
          <div className="text-destructive">{error}</div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {loading ? (
                <>
                  <img alt="loader" src="/spinner.gif" width={25} />
                  <div className="pl-2">Logging In...</div>
                </>
              ) : (
                <div>Login</div>
              )}
            </Button>
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <div className="text-black text-sm">New User?</div>
                <Button
                  type="button"
                  onClick={handleSignUpRedirect}
                  variant="link"
                  className="pl-0 flex gap-3"
                >
                  <div className="font-medium">SignUp</div>
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  onClick={handleForgotPassword}
                  variant="link"
                  className="pl-0 flex gap-3"
                >
                  <div>Forgot password?</div>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
