import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_PROFILE, UPDATE_PROFILE } from '../Apollo/queries';
import '../css/ProfilePage.css';
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
import { useNavigate } from 'react-router-dom';
// Zod schema for form validation
const formSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(50, "Username can't exceed 50 characters"),
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
const ProfilePage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalValues, setOriginalValues] = useState(null); // To store the original values
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
  });
  // Fetch user profile using GraphQL query
  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { userId },
    skip: !userId,
  });
  const [updateProfile] = useMutation(UPDATE_PROFILE);
  // Fetch user ID from local storage and update form values based on the fetched profile
  useEffect(() => {
    const userId = parseInt(localStorage.getItem('userData'), 10);
    setUserId(userId);
    if (data) {
      const user = data.userById;
      const userData = {
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstname || '',
        lastName: user.lastname || '',
        phoneNumber: user.phoneNumber || '',
      };
      setOriginalValues(userData); // Save original values for cancellation
      form.reset(userData); // Update form values
    }
  }, [data, form]);
  if (loading) return <p> </p>;
  if (error) return <p>Error fetching profile data.</p>;
  // Handle form submission
  const onSubmit = async (formData) => {
    console.log('Form Data:', formData);
    try {
      await updateProfile({
        variables: {
          userId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        },
      });
      console.log("im going back to unedit",);
      setIsEditing(false); // Turn off edit mode
      refetch(); // Refetch profile data after saving
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };
  // Handle edit button click
  const handleEditClick = () => {
    console.log("Entering Edit Mode");
    setIsEditing(true); // Turn on edit mode
  };
  // Handle cancel button click
  const handleCancelClick = () => {
    form.reset(originalValues); // Reset the form to the original values
    setIsEditing(false); // Turn off edit mode
  };
  const handleChangePassword = () => {
    navigate('/change-password');
  };
  return (
    <div className="w-full flex justify-center pt-12">
      <div className="flex flex-col border bg-white space-y-3 w-1/3 p-6 rounded-lg shadow-2xl z-10">
        <div className="font-bold text-xl ">User Profile</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* First Name Field */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="First Name"
                      {...field}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Last Name Field */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Last Name"
                      {...field}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Phone Number Field */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone Number"
                      {...field}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Edit/Save and Cancel Buttons */}
            {isEditing ? (
              <div className="flex space-x-4">
                <Button type="button"
                onClick={form.handleSubmit(onSubmit)}
                className="w-full">
                  Save
                </Button>
                <Button
                  type="button"
                  onClick={handleCancelClick}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex justify-between">
                <Button onClick={handleEditClick}>Edit Profile</Button>
                <Button onClick={handleChangePassword}>Change Password</Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};
export default ProfilePage;