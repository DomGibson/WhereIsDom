import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast } from '@chakra-ui/react';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database'; // Import Realtime Database methods
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  // Handle user login
  const handleUserLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Check if the user is primary or secondary
      const role = user.email === "djoegibson01@gmail.com" ? "primary" : "secondary";
  
      // Reference to the user's data in the Realtime Database
      const userRef = ref(db, `users/${user.uid}`);
  
      // Create user data object based on role
      const userData = {
        email: user.email,
        role: role,
        lastLogin: new Date().toISOString(),
        active: role === 'primary' ? true : false,
      };
  
      // Add totalMileage field only for primary users
      if (role === 'primary') {
        userData.totalMileage = 0;
      }
  
      // Add trackingPrimaryUserId field only for secondary users
      if (role === 'secondary') {
        userData.trackingPrimaryUserId = 'primary-uid'; // Replace with the actual primary user's UID
      }
  
      // Update or create user data in Realtime Database
      await set(userRef, userData);
  
      // Redirect based on role
      if (role === 'primary') {
        navigate('/d-p');
      } else {
        navigate('/d-s');
      }
  
      // Show success toast
      toast({
        title: 'Login successful.',
        description: `Welcome ${role} user!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error logging in:', error);
      toast({
        title: 'Login Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  return (
    <Box
      d="flex"
      alignItems="center"
      justifyContent="center"
      h="100vh"
      bg="gray.100"
    >
      <Box
        maxW="md"
        p={8}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg="white"
      >
        <Heading mb={6}>Login</Heading>
        <FormControl id="email" mb={4}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormControl>
        <FormControl id="password" mb={6}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </FormControl>
        <Button
          colorScheme="teal"
          size="md"
          width="full"
          onClick={handleUserLogin} // Call handleUserLogin when button is clicked
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
