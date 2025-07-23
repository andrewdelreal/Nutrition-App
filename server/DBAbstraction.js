const sqlite3 = require('sqlite3');

class DBAbstraction {
    constructor(fileName) {
        this.fileName = fileName;
    }

    init() {
        return new Promise((resolve, reject) => { 
            this.db = new sqlite3.Database(this.fileName, async (err) => { 
                if(err) { 
                    reject(err); 
                } else { 
                    try { 
                        await this.createTables(); 
                        resolve(); 
                    } catch (err) { 
                        reject(err) 
                    } 
                } 
            }); 
        }); 
    }

    createTables() {  
        const sql = `
            CREATE TABLE IF NOT EXISTS "User" (
                "userId" INTEGER PRIMARY KEY,
                "username" TEXT UNIQUE,
                "hashedPassword" TEXT
            );

            CREATE TABLE IF NOT EXISTS "Food" (
                "foodId" INTEGER PRIMARY KEY,
                "name" TEXT UNIQUE,
                "calories" REAL,
                "carbs" REAL,
                "fat" REAL,
                "protein" REAL,
                "weight" REAL
            );

            CREATE TABLE IF NOT EXISTS "Portion" (
                "portionId" INTEGER PRIMARY KEY,
                "date" TEXT,
                "quantity" REAL,
                "foodId" INTEGER NOT NULL,
                "userId" INTEGER NOT NULL, 
                FOREIGN KEY("foodId") REFERENCES "Food"("foodId"),
                FOREIGN KEY("userId") REFERENCES "User"("userId")
            );

            CREATE TABLE IF NOT EXISTS "PersonalFood" (
                "personalFoodId" INTEGER PRIMARY KEY,
                "name" TEXT UNIQUE,
                "calories" REAL,
                "carbs" REAL,
                "fat" REAL,
                "protein" REAL,
                "weight" REAL,
                "userId" INTEGER NOT NULL, 
                FOREIGN KEY("userId") REFERENCES "User"("userId")
            );
        `; 
 
        return new Promise((resolve, reject) => { 
            this.db.exec(sql, (err) => {                 
                if(err) { 
                    reject(err); 
                } else { 
                    resolve(); 
                } 
            }); 
        }); 
    } 

    registerUser(username, hashedPassword) {
        const sql = 'INSERT INTO User (username, hashedPassword) VALUES (?, ?);';

        return new Promise((resolve, reject) => {
            this.db.run(sql, [username, hashedPassword], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    getUserByUsername(username) {
        const sql = 'SELECT username, hashedPassword FROM User WHERE username = ?;';

        return new Promise((resolve, reject) => {
            this.db.get(sql, [username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    getUserIdByUsername(username) {
        const sql = 'SELECT userId FROM User WHERE username = ?;';

        return new Promise((resolve, reject) => {
            this.db.get(sql, [username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    insertFood(name, calories, carbs, fat, protein, weight) {
        const sql = `INSERT INTO Food (name, calories, carbs, fat, protein, weight) VALUES (?, ?, ?, ?, ?, ?);`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [name, calories, carbs, fat, protein, weight], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    insertPersonalFood(name, calories, carbs, fat, protein, weight, userId) {
        const sql = `INSERT INTO PersonalFood (name, calories, carbs, fat, protein, weight, userId) VALUES (?, ?, ?, ?, ?, ?, ?);`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [name, calories, carbs, fat, protein, weight, userId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    insertPortion(date, quantity, food, source, username) {
        let sql = ``;

        if (source === 'personal') {
            sql = `
            WITH foodId AS (
                SELECT personalFoodId AS foodId FROM PersonalFood
                WHERE name = ?
            ), userId AS (
                SELECT userId FROM User
                WHERE username = ?
            )
            `;
        } else if (source === 'global') {
            sql = `
            WITH foodId AS (
                SELECT foodId FROM Food
                WHERE name = ?
            ), userId AS (
                SELECT userId FROM User
                WHERE username = ?
            )
            `;
        }

        sql += `
            INSERT INTO Portion (date, quantity, foodId, userId, source)
            SELECT 
                ?, 
                ?, 
                foodId.foodId, 
                userId.userId,
                ?
            FROM foodId, userId;
        `;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [food, username, date, quantity, source], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    getPortionsAndNutritionByUsernameAndDay(username, day) {
        const sql = `
        SELECT 
            Portion.portionId,
            COALESCE(PersonalFood.name, Food.name) AS name,
            COALESCE(PersonalFood.calories, Food.calories) AS calories,
            COALESCE(PersonalFood.carbs, Food.carbs) AS carbs,
            COALESCE(PersonalFood.fat, Food.fat) AS fat,
            COALESCE(PersonalFood.protein, Food.protein) AS protein,
            COALESCE(PersonalFood.weight, Food.weight) AS weight,
            Portion.date,
            Portion.quantity
        FROM Portion
        JOIN User ON Portion.userId = User.userId
        LEFT JOIN Food ON Portion.foodId = Food.foodId AND Portion.source = 'global'
        LEFT JOIN PersonalFood ON Portion.foodId = PersonalFood.personalFoodId AND Portion.source = 'personal'
        WHERE User.username = ?
        AND Portion.date LIKE ?
        ORDER BY Portion.date ASC;
        `;

        return new Promise((resolve, reject) => {
            this.db.all(sql, [username, `${day}%`], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    getFoodsByQuery(query, userId) {
        const sql = `
            SELECT name, foodId, source
            FROM (
                SELECT name, foodId, 'global' AS source
                FROM Food
                WHERE name LIKE ? COLLATE NOCASE

                UNION ALL

                SELECT name, personalFoodId AS foodId, 'personal' AS source
                FROM PersonalFood
                WHERE name LIKE ? COLLATE NOCASE
                AND userId = ?
            ) AS combined
            ORDER BY source DESC
            LIMIT 10;
        `;

        return new Promise((resolve, reject) => {
            this.db.all(sql, [`%${query}%`, `%${query}%`, userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    getFoodsDataByFood(foodId, source, userId) {
        let sql = ``;
        let params = [];

        if (source === 'personal') {
            sql = `
                SELECT name, personalFoodId, calories, carbs, fat, protein, weight FROM PersonalFood
                WHERE personalFoodId = ?
                AND userId = ?;
            `;
            params = [foodId, userId];
        } else if (source === 'global') {
            sql = `
                SELECT name, foodId, calories, carbs, fat, protein, weight FROM Food
                WHERE foodId = ?;
            `;
            params = [foodId];
        }

        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    deletePortionByPortionId(portionId) {
        const sql = `
            DELETE FROM Portion
            WHERE portionId = ?;
        `;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [portionId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = DBAbstraction;
