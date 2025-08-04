"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = __importStar(require("sqlite3"));
class DBAbstraction {
    constructor(fileName) {
        this.fileName = fileName;
    }
    init() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.fileName, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    reject(err);
                }
                else {
                    try {
                        yield this.createTables();
                        resolve();
                    }
                    catch (err) {
                        reject(err);
                    }
                }
            }));
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
                "source" TEXT DEFAULT 'global', 
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
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    registerUser(username, hashedPassword) {
        const sql = 'INSERT INTO User (username, hashedPassword) VALUES (?, ?);';
        return new Promise((resolve, reject) => {
            this.db.run(sql, [username, hashedPassword], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    getUserByUsername(username) {
        const sql = 'SELECT username, hashedPassword FROM User WHERE username = ?;';
        return new Promise((resolve, reject) => {
            this.db.get(sql, [username], (err, row) => {
                if (err)
                    reject(err);
                else
                    resolve(row);
            });
        });
    }
    getUserIdByUsername(username) {
        const sql = 'SELECT userId FROM User WHERE username = ?;';
        return new Promise((resolve, reject) => {
            this.db.get(sql, [username], (err, row) => {
                if (err)
                    reject(err);
                else
                    resolve(row);
            });
        });
    }
    insertFood(name, calories, carbs, fat, protein, weight) {
        const sql = `INSERT INTO Food (name, calories, carbs, fat, protein, weight) VALUES (?, ?, ?, ?, ?, ?);`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [name, calories, carbs, fat, protein, weight], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    insertPersonalFood(name, calories, carbs, fat, protein, weight, userId) {
        const sql = `INSERT INTO PersonalFood (name, calories, carbs, fat, protein, weight, userId) VALUES (?, ?, ?, ?, ?, ?, ?);`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [name, calories, carbs, fat, protein, weight, userId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
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
        }
        else if (source === 'global') {
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
                if (err)
                    reject(err);
                else
                    resolve();
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
                if (err)
                    reject(err);
                else
                    resolve(rows);
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
                if (err)
                    reject(err);
                else
                    resolve(rows);
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
        }
        else if (source === 'global') {
            sql = `
                SELECT name, foodId, calories, carbs, fat, protein, weight FROM Food
                WHERE foodId = ?;
            `;
            params = [foodId];
        }
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err)
                    reject(err);
                else
                    resolve(row);
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
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
}
exports.default = DBAbstraction;
