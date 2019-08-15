import * as React from "react";
import TopAppBar, {
    TopAppBarIcon,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarTitle,
} from '@material/react-top-app-bar';
import MaterialIcon from '@material/react-material-icon';
import '@material/react-top-app-bar/dist/top-app-bar.css';
import '@material/react-material-icon/dist/material-icon.css';

/*
const MenuItems = [
    { name: 'Budgets', href: '/budgets' },
    { name: 'Categories', href: '/categories' },
    { name: 'Import', href: '/import' },
];*/

export const Header = (props: { title: string, actions: React.ReactElement[] }) => (
        <TopAppBar fixed>
            <TopAppBarRow>
                <TopAppBarSection align='start'>
                    <TopAppBarIcon navIcon tabIndex={0}>
                        <MaterialIcon hasRipple icon='menu' onClick={() => console.log('click')} />
                    </TopAppBarIcon>
                    <TopAppBarTitle>{ props.title }</TopAppBarTitle>
                </TopAppBarSection>
                <TopAppBarSection align='end' role='toolbar'>
                    { props.actions && props.actions.map(a => (
                        <TopAppBarIcon actionItem tabIndex={0}>
                            { a }
                        </TopAppBarIcon>
                    ))}
                </TopAppBarSection>
            </TopAppBarRow>
        </TopAppBar>
);
