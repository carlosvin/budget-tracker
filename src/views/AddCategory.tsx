import * as React from 'react';
import { categoriesStore } from '../stores/CategoriesStore';
import { RouterProps } from 'react-router';
import { CategoryForm } from './CategoryForm';

export class AddCategory extends React.PureComponent<RouterProps, {name: string}> {
    
    render () {
        return (
            <form>
                <CategoryForm {...this.props}/>
            </form>
        );
    }
}