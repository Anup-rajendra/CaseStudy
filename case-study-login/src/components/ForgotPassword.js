import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'sonner';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';

// Define the form schema using Zod
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Initialize form handling with react-hook-form and zodResolver
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle form submission for sending OTP
  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5297/api/SignInApi/forgot-password',
        { Email: formData.email }
      );
      if (response.status === 200) {
        toast.success('OTP sent to your email');
        setTimeout(() => {
          navigate('/verify-otp', { state: { email: formData.email } });
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // Handle navigation to login
  const handleLogin = () => {
    navigate('/login');
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
      <div className="bg-white space-y-6 w-1/3 p-8 border rounded-lg shadow-2xl z-10">
        <Toaster />
        <div className="text-3xl font-bold pb-2">Forgot Password</div>
        <div className="text-destructive">{message}</div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {loading ? (
                <>
                  <img alt="loader" src="/spinner.gif" width={25} />
                  <div className="pl-2">Sending OTP</div>
                </>
              ) : (
                <div>Send OTP</div>
              )}
            </Button>

            <div>
              <Button
                type="button"
                onClick={handleLogin}
                variant="link"
                className="p-0"
              >
                <div>Go back to Login</div>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
