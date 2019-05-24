import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CategoryForm } from './CategoryForm';

interface EditCategoryProps extends RouteComponentProps<{name: string}>{}

export const EditCategory: React.FC<EditCategoryProps> = (props) => (
    <CategoryForm {...props} cancel delete save name={props.match.params.name} closeAfterSave/>
);

export default EditCategory;
