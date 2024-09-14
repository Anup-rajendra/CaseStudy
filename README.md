#Forgot Password Functionality

I only made changes in case-study-login and AddUserCaseStudy for this functionality

In the Database I have added two columns in the users table to handle the OTP

/*forgot password*/
ALTER TABLE Users
ADD OTPCode VARCHAR(10);  -- To store the OTP code for password reset

ALTER TABLE Users
ADD OTPVerified BIT DEFAULT 0; -- To check if the OTP was verified (1 means verified)

Remember to add these and scaffold in the AddUserCaseStudy
