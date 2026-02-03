import React from 'react';

const Menu = ({ addToCart }) => {
    const menuItems = {
        "מאכלים": [
            { id: 1, name: 'פיצה-פיתה', description: 'פיצה טעימה על פיתה', price: 35, image: 'https://via.placeholder.com/150' },
            { id: 2, name: 'פיצה-לוואח', description: 'פיצהלוואח קריספי ', price: 40, image: 'https://via.placeholder.com/150' },
            { id: 3, name: 'חביתה', description: 'חביתה עשירה לבחירתכם', price: 25, image: 'https://via.placeholder.com/150' },
            { id: 4, name: 'טוסט', description: 'טוסט גבינה מפנק', price: 30, image: 'https://via.placeholder.com/150' }
        ],
        "שתייה": [
            { id: 5, name: 'מים', description: 'מים מינרליים', price: 8, image: 'https://via.placeholder.com/150' },
            { id: 6, name: 'פטל', description: 'מיץ פטל ', price: 10, image: 'https://via.placeholder.com/150' },
            { id: 7, name: 'סודה', description: 'סודה קרה', price: 9, image: 'https://via.placeholder.com/150' },
            { id: 8, name: 'קפה', description: 'קפה איכותי', price: 12, image: 'https://via.placeholder.com/150' },
            { id: 9, name: 'שוקו', description: 'שוקו חם ומפנק', price: 14, image: 'https://via.placeholder.com/150' },
            { id: 10, name: 'תה', description: 'תה נענע', price: 10, image: 'https://via.placeholder.com/150' }
        ],
        "קינוחים": [
            { id: 11, name: 'קרפ', description: 'קרפ צרפתי עם שוקולד', price: 28, image: 'https://via.placeholder.com/150' },
            { id: 12, name: 'שוקולד', description: 'עוגת שוקולד עשירה', price: 32, image: 'https://via.placeholder.com/150' },
            { id: 13, name: 'פנקייקים', description: 'פנקייקים עם סירופ מייפל', price: 30, image: 'https://via.placeholder.com/150' }
        ]
    };

    return (
        <div className="container">
            <h2 className="text-center mb-4">הנה התפריט:</h2>
            {Object.keys(menuItems).map(category => (
                <div key={category} className="mb-5">
                    <h3 className="mb-3" style={{ borderBottom: '2px solid #4a90e2', paddingBottom: '10px', color: '#333' }}>{category}</h3>
                    <div className="row">
                        {menuItems[category].map(dish => (
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
