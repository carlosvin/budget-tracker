import * as React from 'react';
import { RouterProps } from 'react-router';
import { CategoryForm } from './CategoryForm';

export class AddCategory extends React.PureComponent<RouterProps, {name: string}> {
    
    render () {
        return (
            <form>
                <CategoryForm {...this.props} closeAfterSave/>
            </form>
        );
    }
}