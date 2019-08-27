import { Flex, Text, Box, Link } from 'rebass';
import * as React from "react";

export interface AppBarProps {
    title: string;
}

export const AppBar: React.FC<AppBarProps> = (props) => (
  <Flex
  px={2}
  color='white'
  bg='black'
  alignItems='center'>
  <Text p={2} fontWeight='bold'>Rebass</Text>
  <Box mx='auto' />
  <Link variant='nav' href='#!'>
    Profile
  </Link>
</Flex>

  );
  