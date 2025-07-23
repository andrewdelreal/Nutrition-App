'use strict' 
 
const express = require('express'); 
const morgan = require('morgan'); 
const bodyParser = require("body-parser"); 
const DBAbstraction = require('./DBAbstraction');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');

const port = 54321;
 
const app = express();
const dbPath = path.join(__dirname, 'data', 'nutrition.sqlite')
const db = new DBAbstraction(dbPath); 
 
app.use(session({
    secret: '1999482184074562-75124802130192',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // only true with HTTPS
        httpOnly: true,
        sameSite: 'lax'
    }
}));

app.use(morgan('dev')); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.static('public'));  

// all the login stuff will change once i have the webcomponent
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.registerUser(username, hashedPassword);
        req.session.username = username;
        res.json({username}); // will probably change this once i have web component
    } catch (err) {
        res.status(500).json({'error': `Username might already exist: ${err}`});
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await db.getUserByUsername(username);

    if (user && await bcrypt.compare(password, user.hashedPassword)) {
        req.session.username = username;
        res.json({username}); // will probably change this once i have web component
    } else {
        res.status(401).json({'error': 'Invalid Credentials'});
    }
});

app.post('/logout', requireLogin, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({'error': `Logout failed: ${err}`});
        }
        res.clearCookie('connect.sid'); // default session cookie name    
        res.json({'message': 'Logged out'});
    });
});

// may add a category or have a wait to search for foods
app.post('/food', requireLogin, async (req, res) => {
    const { name, calories, carbs, fat, protein, weight } = req.body;

    try {
        await db.insertFood(name, calories, carbs, fat, protein, weight);
        res.json({'success': 'Food successfully added'});
    } catch (err) {
        res.status(500).json({'error': `Failed to insert food into the database: ${err}`});
    }
});

app.post('/personal-food', requireLogin, async (req, res) => {
    const { name, calories, carbs, fat, protein, weight } = req.body;
    const username = req.session.username;

    try {
        const { userId } = await db.getUserIdByUsername(username);
        await db.insertPersonalFood(name, calories, carbs, fat, protein, weight, userId);
        res.json({'success': 'Personal Food successfully added'});
    } catch (err) {
        res.status(500).json({'error': `Failed to insert food into the database: ${err}`});
    }
});

app.post('/portion', requireLogin, async (req, res) => {
    const { date, quantity, food, source} = req.body;
    const username = req.session.username;

    try {
        await db.insertPortion(date, quantity, food, source, username);
        res.json({'success': 'Portion successfully added'});
    } catch (err) {
        res.status(500).json({'error': `Failed to insert portion into the database: ${err}`});
    }
});

app.post('/portion/get-portions', requireLogin, async (req, res) => {
    const { date } = req.body;
    const username = req.session.username;
    const day = getDay(date);

    try {
        let portions = await db.getPortionsAndNutritionByUsernameAndDay(username, day);
        portions = adjustPortions(portions);
        res.json(portions);
    } catch (err) {
        res.status(500).json({'error': `Failed to get user portions, ${err}`});
    }
});

app.post('/get-foods', requireLogin, async (req, res) => {
    const query = req.body.query;
    const username = req.session.username;

    try {
        const { userId } = await db.getUserIdByUsername(username);
        const foods = await db.getFoodsByQuery(query, userId);
        res.json(foods);
    } catch (err) {
        res.status(500).json({'error': `Failed to get foods: ${err}`});
    }
});

app.post('/get-food-data', requireLogin, async (req, res) => {
    const { foodId, source } = req.body;
    const username = req.session.username;

    try {
        const { userId } = await db.getUserIdByUsername(username);
        const foodData = await db.getFoodsDataByFood(foodId, source, userId);
        res.json(foodData);
    } catch (err) {
        res.status(500).json({'error': `Failed to get food data: ${err}`});
    }
});

app.post('/delete-portion', requireLogin, async (req, res) => {
    const portionId = req.body.portionId;

    try {
        await db.deletePortionByPortionId(portionId);
        res.json({'success': 'Portion successfully deleted'});
    } catch (err) {
        res.status(500).json({'error': `Failed to delete portion: ${err}`});
    }
})

app.get('/session', (req, res) => {
    if (req.session && req.session.username) {
        res.json({ username: req.session.username });
    } else {
        res.status(204).end(); 
    }
});

db.init() 
    .then(() => { 
        app.listen(port, () => console.log(`The server is up and running at http://localhost:${port}/index.html`)); 
    }) 
    .catch(err => { 
        console.error(`Problem setting up the database: ${err}`); 
    });

function getDay(date) {
    return date.substring(0, date.indexOf("T"));
}

function adjustPortions(portions) {
    for (let i = 0; i < portions.length; i++) {
        const multiplier = parseFloat(portions[i]['quantity'])
        portions[i]['calories'] *=  multiplier;
        portions[i]['carbs'] *=  multiplier;
        portions[i]['fat'] *=  multiplier;
        portions[i]['protein'] *=  multiplier;
        portions[i]['weight'] *=  multiplier;
    }

    return portions;
}

function requireLogin(req, res, next) {
    if (req.session && req.session.username) {
        next(); 
    } else {
        res.json({'error': 'You must be logged in to access this feature'}); 
    }
}
