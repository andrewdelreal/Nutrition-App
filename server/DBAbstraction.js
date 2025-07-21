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

    insertPortion(date, quantity, food, username) {
        const sql = `
            WITH foodId AS (
                SELECT foodId FROM Food
                WHERE name = ?
            ), userId AS (
                SELECT userId FROM User
                WHERE username = ?
            )


            INSERT INTO Portion (date, quantity, foodId, userId)
            SELECT 
                ?, 
                ?, 
                foodId.foodId, 
                userId.userId
            FROM foodId, userId;
        `;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [food, username, date, quantity], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    getPortionsAndNutritionByUsernameAndDay(username, day) {
        const sql = `
        SELECT 
            Portion.portionId,
            Food.name,
            Food.calories,
            Food.carbs,
            Food.fat,   
            Food.protein,
            Food.weight,
            Portion.date,
            Portion.quantity
        FROM Portion
        JOIN Food on Portion.foodId = Food.foodId
        JOIN User on Portion.userId = User.userId
        WHERE User.userId = (
            SELECT userId
            FROM User
            WHERE username = ?
        )
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

    getFoodsDataByFood(food) {
        const sql = `
            SELECT name, foodId, calories, carbs, fat, protein, weight FROM Food
            WHERE name = ? COLLATE NOCASE;
        `;

        return new Promise((resolve, reject) => {
            this.db.get(sql, [food], (err, row) => {
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
