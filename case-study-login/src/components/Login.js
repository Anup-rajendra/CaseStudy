import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import { Form, FormField, FormControl, FormLabel, FormItem, FormDescription, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(50, "Username can't exceed 50 characters"),
  password: z.string().min(2, "Password must be at least 2 characters").max(50, "Password can't exceed 50 characters"),
});

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = React.useState('');

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          password: "",
        },
    });

    console.log("Form object:", form);  // Add this line to inspect the form object

    const onSubmit = async (data) => {
        try {
            const { username, password } = data;

            const response = await axios.post('http://localhost:5185/api/RetailAPI/authenticate', 
                { Username: username, Password: password }, 
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            const token = response.data.token;

            localStorage.setItem('token', token);

            const getUserDetails = await axios.get(`http://localhost:5185/api/RetailAPI/${username}/${password}`);

            const userData = {
                UserId: getUserDetails.data,  // Adjust the property name as per your API response
            };

           

            navigate('/products');
        } catch (error) {
            console.error('Login failed:', error);
            setError('Invalid username or password');
        }
    };

    const handleSignUpRedirect = () => {
        navigate('/signing');
    };

    return (
        <div>
             <h2>Login</h2>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-1/2 p-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormDescription>This is your public display name.</FormDescription>
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
                <Button type="submit">Login</Button>
                <div>
                    <Button type="button" onClick={handleSignUpRedirect}>
                        Don't Have An Account?
                    </Button>
                </div>
            </form>
        </Form>
        </div>
    );
};

export default Login;
