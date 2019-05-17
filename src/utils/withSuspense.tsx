import * as React from 'react';

export const withSuspense = (ComponentType: React.ComponentType<any>, ps = {}) => {
    return (props: any) => (
        <React.Suspense fallback='loading view'>
            <ComponentType {...props} {...ps}/>
        </React.Suspense>
    );
}