import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE } from '../Apollo/queries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Form, FormField, FormControl, FormLabel, FormItem, FormMessage } from './ui/form';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const ChangePasswordPage = () => {
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

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const handleChangePassword = async (formData) => {
    // Clear previous messages
    setMessage('');

    // Validation checks
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
      setMessage('All fields are required.');
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage('New passwords do not match.');
      return;
    }

    try {
      await axios.post('http://localhost:5297/api/SignInApi/change-password', {
        UserId: userId,
        CurrentPassword: formData.currentPassword,
        NewPassword: formData.newPassword,
      });

      // Show success message and redirect
      setMessage('Password changed successfully.');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    } catch (err) {
      // Handle errors from the API
      setMessage('Error changing password: ' + (err.response?.data || 'An error occurred.'));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching profile data.</p>;

  return (
    <div className="w-full flex justify-center pt-12">
      <div className="flex flex-col border bg-white space-y-3 w-1/3 p-6 rounded-lg shadow-2xl z-10">
        <div className="font-bold text-xl">Change Password</div>

        {message && (
          <div className="mb-4 p-2 text-center text-red-600">
            {message}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleChangePassword)} className="space-y-4">
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
            <Button type="submit" className="w-full">Change Password</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
