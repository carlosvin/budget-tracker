import * as React from 'react';
import { RouterProps } from 'react-router';
import { CategoryForm } from './CategoryForm';

export const AddCategory: React.FC<RouterProps> = (props) => (
    <CategoryForm {...props} cancel delete save/>
);

export default AddCategory;