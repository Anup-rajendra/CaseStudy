import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'sonner';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';

// Define the schema
const formSchema = z.object({
  otp: z
    .string()
    .min(4, 'OTP must be 4 characters.')
    .max(4, 'OTP must be 4 characters.'),
});

const VerifyOtp = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const email = location.state?.email;

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Handle OTP verification
  const handleVerifyOtp = async (formData) => {
    console.log(formData);
    setLoading(true);
    const otp = formData.otp;
    try {
      const response = await axios.post(
        'http://localhost:5297/api/SignInApi/reset-password',
        {
          Email: email,
          Otp: formData.otp,
          NewPassword: '', // Leave empty; password reset will happen on the next page
        }
      );
      if (response.status === 200) {
        toast.success('OTP is Verified');
        setTimeout(() => {
          navigate('/reset-password', { state: { email, otp } });
        }, 2000);
      } else {
        setMessage('Invalid OTP.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('Failed to verify OTP. Please try again.');
      setLoading(false);
    }
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
        <div className="text-3xl font-bold pb-2 text-center">
          OTP Verification
        </div>
        <div className="flex flex-col gap-2 items-center">
          <div>One Time Password(OTP) has been sent via Email to </div>
          <div className="text-center font-semibold">{email}</div>
          <div className="text-center">Enter the OTP below to verify it</div>
        </div>
        <div className="text-destructive">{message}</div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleVerifyOtp)}
            className="space-y-8"
          >
            <div className="flex items-center justify-center">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP maxLength={4} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              {loading ? (
                <>
                  <img alt="loader" src="/spinner.gif" width={25} />
                  <div className="pl-2">Verifying OTP</div>
                </>
              ) : (
                <div>Verify OTP</div>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyOtp;
