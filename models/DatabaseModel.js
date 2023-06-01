import pool from "../config/db.js";

class DatabaseModel {

    constructor(table){
        this.table = table;
    }

    async findAll() {
        const [rows] = await pool.query(`SELECT * FROM ${this.table} ORDER BY created DESC`);
        return rows;
    }

    async findById(id) {
        const [row] = await pool.query(`SELECT * FROM ${this.table} WHERE id=?`, [id]);
        return row[0];
    }

    async findEmail(query) {
        const [row] = await pool.query(`SELECT * FROM ${this.table} WHERE email=?`, [query]);
        return row[0];
    }

    async create(obj) {
        let fields = [];
        let params = [];
        let placeholder = [];
        for (const [key, value] of Object.entries(obj)) {
            fields.push(key);
            placeholder.push('?')
            params.push(value);
        }

        const [result] = await pool.query(
            `INSERT INTO ${this.table} (${fields.join()}) VALUES(${placeholder.join()})`,
        params);
        const id = result.insertId;
        return await this.findById(id);
    }

    async update(id,obj) {
        let fields = [];
        let params = [];
        for (const [key, value] of Object.entries(obj)) {
            fields.push(`${key}=?`);
            params.push(value);
        }
        params.push(id);
        await pool.query(
            `UPDATE ${this.table} SET ${fields.join()} WHERE id=?`,params
        );
        return await this.findById(id);
    }

    async deleteById(id){
        await pool.query(`DELETE FROM ${this.table} WHERE id=?`, [id]);
        return await this.findById(id);
    }

}

export default DatabaseModel;