"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cors_1 = __importDefault(require("cors"));
const DBAbstraction_1 = __importDefault(require("./DBAbstraction"));
const port = 54321;
const app = (0, express_1.default)();
const dbPath = path_1.default.join(__dirname, '..', 'data', 'nutrition.sqlite');
const db = new DBAbstraction_1.default(dbPath);
app.use((0, express_session_1.default)({
    secret: '1999482184074562-75124802130192',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // only true with HTTPS
        httpOnly: true,
        sameSite: 'lax'
    }
}));
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.static('public'));
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        yield db.registerUser(username, hashedPassword);
        req.session.username = username;
        res.json({ username });
    }
    catch (err) {
        res.status(500).json({ 'error': `Username might already exist: ${err}` });
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db.getUserByUsername(username);
    if (user && (yield bcrypt_1.default.compare(password, user.hashedPassword))) {
        req.session.username = username;
        res.json({ username }); // will probably change this once i have web component
    }
    else {
        res.status(401).json({ 'error': 'Invalid Credentials' });
    }
}));
app.post('/logout', requireLogin, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ 'error': `Logout failed: ${err}` });
        }
        res.clearCookie('connect.sid'); // default session cookie name    
        res.json({ 'message': 'Logged out' });
    });
});
// may add a category or have a wait to search for foods
app.post('/food', requireLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, calories, carbs, fat, protein, weight } = req.body;
    try {
        yield db.insertFood(name, calories, carbs, fat, protein, weight);
        res.json({ 'success': 'Food successfully added' });
    }
    catch (err) {
        res.status(500).json({ 'error': `Failed to insert food into the database: ${err}` });
    }
}));
app.post('/personal-food', requireLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, calories, carbs, fat, protein, weight } = req.body;
    const username = req.session.username;
    try {
        const { userId } = yield db.getUserIdByUsername(username);
        yield db.insertPersonalFood(name, calories, carbs, fat, protein, weight, userId);
        res.json({ 'success': 'Personal Food successfully added' });
    }
    catch (err) {
        res.status(500).json({ 'error': `Failed to insert food into the database: ${err}` });
    }
}));
app.post('/portion', requireLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, quantity, food, source } = req.body;
    const username = req.session.username;
    try {
        yield db.insertPortion(date, quantity, food, source, username);
        res.json({ 'success': 'Portion successfully added' });
    }
    catch (err) {
        res.status(500).json({ 'error': `Failed to insert portion into the database: ${err}` });
    }
}));
app.post('/portion/get-portions', requireLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.body;
    const username = req.session.username;
    const day = getDay(date);
    try {
        let portions = yield db.getPortionsAndNutritionByUsernameAndDay(username, day);
        portions = adjustPortions(portions);
        res.json(portions);
    }
    catch (err) {
        res.status(500).json({ 'error': `Failed to get user portions, ${err}` });
    }
}));
app.post('/get-foods', requireLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.body.query;
    const username = req.session.username;
    try {
        const { userId } = yield db.getUserIdByUsername(username);
        const foods = yield db.getFoodsByQuery(query, userId);
        res.json(foods);
    }
    catch (err) {
        res.status(500).json({ 'error': `Failed to get foods: ${err}` });
    }
}));
app.post('/get-food-data', requireLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { foodId, source } = req.body;
    const username = req.session.username;
    try {
        const { userId } = yield db.getUserIdByUsername(username);
        const foodData = yield db.getFoodsDataByFood(foodId, source, userId);
        res.json(foodData);
    }
    catch (err) {
        res.status(500).json({ 'error': `Failed to get food data: ${err}` });
    }
}));
app.post('/delete-portion', requireLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const portionId = req.body.portionId;
    try {
        yield db.deletePortionByPortionId(portionId);
        res.json({ 'success': 'Portion successfully deleted' });
    }
    catch (err) {
        res.status(500).json({ 'error': `Failed to delete portion: ${err}` });
    }
}));
app.get('/session', (req, res) => {
    if (req.session && req.session.username) {
        res.json({ username: req.session.username });
    }
    else {
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
        const multiplier = portions[i]['quantity'];
        portions[i]['calories'] *= multiplier;
        portions[i]['carbs'] *= multiplier;
        portions[i]['fat'] *= multiplier;
        portions[i]['protein'] *= multiplier;
        portions[i]['weight'] *= multiplier;
    }
    return portions;
}
function requireLogin(req, res, next) {
    if (req.session && req.session.username) {
        next();
    }
    else {
        res.json({ 'error': 'You must be logged in to access this feature' });
    }
}
