import React from 'react';

const Dashboard = () => {

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Instituto Superior Tecnológico Luis Rogerio González</h5>
                    <p>Estudiante: Valeria Estefania Dominguez Ibarra </p>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Dashboard, comparisonFn);
