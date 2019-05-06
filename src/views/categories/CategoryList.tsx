import * as React from 'react';
import { RouterProps } from 'react-router';
import { CategoryForm } from './CategoryForm';
import { categoriesStore } from '../../stores/CategoriesStore';


export class CategoryList extends React.PureComponent<RouterProps> {
    
    render () {
        return (
            <form>
                { categoriesStore.getCategories().map(c => 
                    <CategoryForm {...this.props} name={c} direction='row' hideCancel={true}/>
                )}
            </form>
        );
    }
}
