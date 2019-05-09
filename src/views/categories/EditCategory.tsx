import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CategoryForm } from './CategoryForm';

interface EditCategoryProps extends RouteComponentProps<{name: string}>{}

export class EditCategory extends React.PureComponent<EditCategoryProps, {name: string}> {
    
    render () {
        return (
            <CategoryForm {...this.props} name={this.props.match.params.name} closeAfterSave/>
        );
    }
}
