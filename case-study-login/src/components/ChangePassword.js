import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE } from '../Apollo/queries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
// Zod schema
const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(1, 'New password is required'),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  });

const ChangePassword = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const { loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    const storedUserId = parseInt(localStorage.getItem('userData'), 10);
    setUserId(storedUserId);
  }, []);

  // Use Zod schema for validation
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const handleChangePassword = async (formData) => {
    // Clear previous messages
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:5297/api/SignInApi/change-password',
        {
          UserId: userId,
          CurrentPassword: formData.currentPassword,
          NewPassword: formData.newPassword,
        }
      );

      if (response.status === 200) {
        setMessage('Password changed successfully.');
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        toast.success('Password is Changed successfully');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (err) {
      // Handle errors from the API
      setMessage(
        'Error changing password: ' +
          (err.response?.data || 'An error occurred.')
      );
    }
  };
  const handleProfile = () => {
    navigate('/profile');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching profile data.</p>;

  return (
    <div className="w-full flex justify-center pt-12">
      <Toaster />
      <div className="flex flex-col border bg-white space-y-3 w-1/3 p-6 rounded-lg shadow-2xl z-10">
        <div className="font-bold text-xl">Change Password</div>

        {message && (
          <div className="mb-4 p-2 text-center text-red-600">{message}</div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleChangePassword)}
            className="space-y-4"
          >
            {/* Current Password Field */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Current Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* New Password Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Confirm New Password Field */}
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm New Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button type="submit">Change Password</Button>
              <Button onClick={handleProfile}>Go Back</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
