import * as React from 'react';
import { RouterProps } from 'react-router';
import { CategoryForm } from './CategoryForm';
import { categoriesStore } from '../../stores/CategoriesStore';
import { AddButton } from '../buttons';
import { Category, TitleNotifierProps } from '../../interfaces';
import { InfoField } from '../InfoField';

interface CategoryListState {
    categories: Category[];
}

export default class CategoryList 
    extends React.PureComponent<RouterProps&TitleNotifierProps, CategoryListState> {

    constructor(props: RouterProps&TitleNotifierProps) {
        super(props);
        props.onTitleChange('Categories');
        this.state = {categories: Object.values(categoriesStore.getCategories())};
    }
    
    render () {
        return (
            <React.Fragment>
                <this.CategoriesMap />
                <AddButton href='/categories/add'/>
            </React.Fragment>
        );
    }

    private CategoriesMap = () => {
        if (this.state.categories.length > 0) {
            return (
                <React.Fragment>
                    {this.state.categories.map(c => 
                        <CategoryForm 
                            {...this.props} 
                            {...c}
                            direction='row' 
                            hideCancel={true} 
                            key={`category-entry-${c.id}`}
                            onChange={ this.handleChange }/>)
                    }
                </React.Fragment>);
        } else {
            return <InfoField 
                label='There are no categories' 
                value='Please add at least one'/>;
        }
    }


    private handleChange = () => {
        this.setState({
            categories: Object.values(categoriesStore.getCategories())
        });
    }
}
