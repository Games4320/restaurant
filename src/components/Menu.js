import React from 'react';

const Menu = ({ addToCart, menu = {} }) => {
    // menu is an object with category keys mapping to arrays of items
    const keys = Object.keys(menu);

    return (
        <div className="container">
            <h2 className="text-center mb-4">הנה התפריט:</h2>
            {keys.map(category => (
                <div key={category} className="mb-5">
                    <h3 className="mb-3" style={{ borderBottom: '2px solid #4a90e2', paddingBottom: '10px', color: '#333' }}>{category}</h3>
                    <div className="row">
                        {menu[category].map(dish => (
                            <div className="col-lg-4 col-md-6 mb-4" key={dish.id}>
                                <div className="card h-100">
                                    <img src={dish.image} className="card-img-top" alt={dish.name} style={{height: '200px', objectFit: 'cover'}}/>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{dish.name}</h5>
                                        <p className="card-text">{dish.description}</p>
                                        <p className="card-text mt-auto"><strong>₪{dish.price}</strong></p>
                                        <button className="btn btn-primary" onClick={() => addToCart(dish)}>הוסף להזמנה</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Menu;
