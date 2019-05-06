import * as React from 'react';
import { RouterProps } from 'react-router';
import { CategoryForm } from './CategoryForm';
import { categoriesStore } from '../../stores/CategoriesStore';

export class CategoryList extends React.PureComponent<RouterProps> {

    private handleChange = () => {
        // TODO fix this trick for triggering render
        this.setState({});
    }
    
    render () {
        return (
            <form>
                { categoriesStore.getCategories().map(c => 
                    <CategoryForm 
                        {...this.props} 
                        name={c} 
                        direction='row' 
                        hideCancel={true} 
                        key={c}
                        onChange={this.handleChange}/>
                )}
            </form>
        );
    }
}
