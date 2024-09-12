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
  email: z
    .string()
    .email('Invalid Email Address')
    .max(50, "Email can't exceed 50 characters"),
  firstName: z
    .string()
    .min(2, 'First Name must be at least 2 characters')
    .max(50, "First Name can't exceed 50 characters"),
  lastName: z
    .string()
    .min(1, 'Last Name must be at least 2 characters')
    .max(50, "Last Name can't exceed 50 characters"),
  phoneNumber: z
    .string()
    .length(10, 'The number must be exactly 10 characters long')
    .regex(/^\d+$/, 'The number must contain only digits'),
});

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [serverOtp, setServerOtp] = useState(null); // To store OTP from backend

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5297/api/SignInApi',
        {
          Username: data.username,
          Password: data.password,
          Email: data.email,
          FirstName: data.firstName,
          LastName: data.lastName,
          PhoneNumber: data.phoneNumber,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setLoading(false);
      console.log(response.data);

      if (response.data) {
        setServerOtp(response.data); // Store the OTP received from the backend
        setShowOtpInput(true); // Show the OTP input
        setError(false); // Clear error if any
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError('Email Already In Use');
    }
  };

  const handleOtpVerification = () => {
    if (otp === serverOtp.toString()) {
      console.log(otp); // Logs the value of otp

      navigate('/login'); // Redirect to a protected page after successful verification
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen -z-10 p-6"
      style={{
        backgroundImage: `url('/login-background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white space-y-6 w-1/3 p-8 border rounded-lg shadow-2xl z-10">
        <div className="text-3xl font-bold pb-2">Sign In</div>
        <Form {...form}>
          <div className="text-destructive">{error}</div>
          {!showOtpInput ? (
            // Registration form
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {loading ? (
                  <>
                    <img alt="loader" src="/spinner.gif" width={25} />
                    <div className="pl-2">Signing Up...</div>
                  </>
                ) : (
                  <div>Sign Up</div>
                )}
              </Button>
            </form>
          ) : (
            // OTP Verification Form
            <div>
              <FormItem>
                <FormLabel>Enter OTP</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <Button
                type="button"
                onClick={handleOtpVerification}
                className="w-full mt-4"
              >
                Verify OTP
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Login;
