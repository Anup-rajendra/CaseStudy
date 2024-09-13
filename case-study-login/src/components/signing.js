import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import { Form, FormField, FormControl, FormLabel, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';


const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(50, "Username can't exceed 50 characters"),
  password: z.string().min(2, "Password must be at least 2 characters").max(50, "Password can't exceed 50 characters"),
  email: z.string().email("Invalid Email Address").max(50, "Email can't exceed 50 characters"),
  firstName: z.string().min(2, "First Name must be at least 2 characters").max(50, "First Name can't exceed 50 characters"),
  lastName: z.string().min(2, "Last Name must be at least 2 characters").max(50, "Last Name can't exceed 50 characters"),
  phoneNumber: z.string()
  .length(10, "The number must be exactly 10 characters long")
  .regex(/^\d+$/, "The number must contain only digits"),
});

const Login = () => {
  const Navigate=useNavigate();
 const [error,setError]=useState(false);
 const [loading,setLoading]=useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          password: "",
          email:"",
          firstName:"",
          lastName:"",
          phoneNumber:"",
        },
    });

    console.log("Form object:", form);  // Add this line to inspect the form object

    
  const navigate=useNavigate();
  const onSubmit = async (data) => {
    try{
      setLoading(true);
        const response=await axios.post('http://localhost:5297/api/SignInApi',{Username:data.username,
            Password:data.password,
            Email:data.email,
            FirstName:data.firstName,
            LastName:data.lastName,
            PhoneNumber:data.phoneNumber
        },
        {
            headers:{
                'Content-Type':'application/json'
            }
        });
        console.log(typeof(formData));
        console.log(response)
        navigate('/login');
    }
    catch(error)
    {
      setLoading(false);
        console.log(error);
        setError('Email Already In Use');
    }
  };

  const handleLoginUpRedirect=()=>{
    Navigate('/login');
  }
    return (
      
        <div className="flex items-center justify-center min-h-screen -z-10 p-6" style={{ backgroundImage: `url('/login-background.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className='bg-white space-y-6 w-1/3 p-8 border  rounded-lg shadow-2xl z-10'>
             <div className='text-3xl font-bold pb-2'>Sign In</div>
        <Form {...form}>
            <div className='text-destructive'>{error}</div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    {loading ? (<><img alt="loader" src='/spinner.gif' width={25}/><div className='pl-2'>Signing Up...</div></>) : (<div>Sign Up</div>)} 
                </Button>
                <div>
                    <Button type="button" onClick={handleLoginUpRedirect} variant="link" className="pl-0">
                        Already Have An Account?&nbsp;&nbsp;Click here
                    </Button>
                </div>
            </form>
        </Form>
        </div>
        </div>
      
    );
};

export default Login;
