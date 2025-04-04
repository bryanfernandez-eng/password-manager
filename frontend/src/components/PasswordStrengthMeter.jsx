import { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Progress,
  VStack,
  HStack,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

const PasswordStrengthMeter = ({ password, showCriteria = true }) => {
  const [strength, setStrength] = useState({
    score: 0,
    label: 'Weak',
    color: 'red.500',
    message: 'Your password is too weak',
  });

  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setStrength({
        score: 0,
        label: 'Weak',
        color: 'red.500',
        message: 'Your password is too weak',
      });
      setCriteria({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      });
      return;
    }

    // Check criteria
    const newCriteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    setCriteria(newCriteria);

    // Count how many criteria are met
    const metCount = Object.values(newCriteria).filter(Boolean).length;

    // Set strength based on criteria met
    let newStrength = {
      score: 0,
      label: 'Very Weak',
      color: 'red.500',
      message: 'Your password is too weak',
    };

    if (metCount === 5) {
      newStrength = {
        score: 100,
        label: 'Very Strong',
        color: 'green.500',
        message: 'Your password is very strong',
      };
    } else if (metCount === 4) {
      newStrength = {
        score: 80,
        label: 'Strong',
        color: 'green.400',
        message: 'Your password is strong',
      };
    } else if (metCount === 3) {
      newStrength = {
        score: 60,
        label: 'Medium',
        color: 'yellow.400',
        message: 'Your password could be stronger',
      };
    } else if (metCount === 2) {
      newStrength = {
        score: 40,
        label: 'Weak',
        color: 'orange.400',
        message: 'Your password is weak',
      };
    } else if (metCount === 1) {
      newStrength = {
        score: 20,
        label: 'Very Weak',
        color: 'red.400',
        message: 'Your password is very weak',
      };
    }

    setStrength(newStrength);
  }, [password]);

  const getProgressColor = (score) => {
    if (score < 30) return 'red.500';
    if (score < 60) return 'orange.400';
    if (score < 80) return 'yellow.400';
    return 'flickr.blue';
  };

  return (
    <VStack spacing={2} width="100%" align="stretch">
      <HStack justifyContent="space-between">
        <Text fontSize="sm" color="flickr.lightGray">
          Password Strength:
        </Text>
        <Text fontSize="sm" color={strength.color} fontWeight="bold">
          {strength.label}
        </Text>
      </HStack>
      
      <Progress 
        value={strength.score} 
        colorScheme={
          strength.score < 30 ? 'red' 
          : strength.score < 60 ? 'orange' 
          : strength.score < 80 ? 'yellow' 
          : 'blue' // Use blue (Flickr blue) for strong passwords
        }
        size="sm"
        borderRadius="md"
        bg="gray.700"
      />
      
      {showCriteria && (
        <Box mt={2}>
          <List spacing={1} fontSize="xs">
            <ListItem display="flex" alignItems="center">
              <ListIcon 
                as={criteria.length ? CheckIcon : CloseIcon} 
                color={criteria.length ? 'flickr.blue' : 'red.400'} 
              />
              <Text color="flickr.lightGray">At least 8 characters</Text>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon 
                as={criteria.uppercase ? CheckIcon : CloseIcon} 
                color={criteria.uppercase ? 'flickr.blue' : 'red.400'} 
              />
              <Text color="flickr.lightGray">Contains uppercase letter</Text>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon 
                as={criteria.lowercase ? CheckIcon : CloseIcon} 
                color={criteria.lowercase ? 'flickr.blue' : 'red.400'} 
              />
              <Text color="flickr.lightGray">Contains lowercase letter</Text>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon 
                as={criteria.number ? CheckIcon : CloseIcon} 
                color={criteria.number ? 'flickr.blue' : 'red.400'} 
              />
              <Text color="flickr.lightGray">Contains number</Text>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon 
                as={criteria.special ? CheckIcon : CloseIcon} 
                color={criteria.special ? 'flickr.blue' : 'red.400'} 
              />
              <Text color="flickr.lightGray">Contains special character</Text>
            </ListItem>
          </List>
        </Box>
      )}
    </VStack>
  );
};

export default PasswordStrengthMeter;