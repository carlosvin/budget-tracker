import * as React from 'react';
import { RouterProps } from 'react-router';
import { CategoryForm } from './CategoryForm';
import { categoriesStore } from '../../stores/CategoriesStore';
import { AddButton } from '../buttons';

export class CategoryList extends React.PureComponent<RouterProps, {categories:[string, any][]}> {

    constructor(props: RouterProps){
        super(props);
        this.state = {categories: Object.entries(categoriesStore.getCategories())};
    }
    
    render () {
        return (
            <React.Fragment>
                { this.state.categories.map(([k, v]) => 
                    <CategoryForm 
                        {...this.props} 
                        categoryId={k}
                        name={v} 
                        direction='row' 
                        hideCancel={true} 
                        key={k} 
                        onChange={ this.handleChange }/>
                )}
                <AddButton href='/categories/add'/>
            </React.Fragment>
        );
    }

    private handleChange = (categoryId: string) => {
        this.setState({
            categories: Object.entries(categoriesStore.getCategories())
        });
    }
}
